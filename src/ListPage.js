import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { listAccounts } from "./graphql/queries";
import { useNavigate } from "react-router-dom";

function ListPage() {
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const apiData = await API.graphql({ query: listAccounts });
      setAccountList(apiData.data.listAccounts.items);
    } catch (error) {
      console.log("error fetching accounts", error);
    }
  }

  const handleSelectChange = (event) => {
    setSelectedAccount(event.target.value);
  }

  return (
    <Container>
      <Row>
        <Col>
          <div className="List text-center my-3">
            <h1 className="mt-5 text-center">Mahjong Score List</h1>
            <Form className="my-3">
              <Form.Group controlId="formAccountSelect">
                <Form.Label>Select account:</Form.Label>
                <Form.Control as="select" value={selectedAccount} onChange={handleSelectChange}>
                  <option value="">--Please select an account--</option>
                  {accountList.map((account) => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
            <div className="text-center my-3">
              <Button variant="info" onClick={() => navigate('/')}>入力画面に戻ルよ</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ListPage;
