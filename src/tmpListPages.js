import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Form, Table } from "react-bootstrap";
import { listScores, listAccounts } from "./graphql/queries";
import { useNavigate } from "react-router-dom";

function ListPage() {
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [scoreList, setScoreList] = useState([]);
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

  const handleSelectChange = async (event) => {
    setSelectedAccount(event.target.value);
    try {
      const apiData = await API.graphql({
        query: listScores,
        variables: {
          Player1ID: { eq: event.target.value },
        },
      });
      setScoreList(apiData.data.listScores.items);
    } catch (error) {
      console.log("error fetching scores", error);
    }
  };

  const getAccountNameById = (id) => {
    const account = accountList.find((account) => account.id === id);
    return account ? account.name : "";
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="List text-center my-3">
            <h1 className="mt-5 text-center">Mahjong Score List</h1>
            <Form className="my-3">
              <Form.Group controlId="formAccountSelect">
                <Form.Label>Select account:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedAccount}
                  onChange={handleSelectChange}
                >
                  <option value="">--Please select an account--</option>
                  {accountList.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
            <div className="text-center my-3">
              <Button variant="info" onClick={() => navigate("/")}>
                対局データの入力ページに戻る
              </Button>
            </div>
            {selectedAccount && (
              <div>
                <h2>{getAccountNameById(selectedAccount)}</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>{getAccountNameById(scoreList[0]?.Player1ID)}</th>
                      <th>{getAccountNameById(scoreList[0]?.Player2ID)}</th>
                      <th>{getAccountNameById(scoreList[0]?.Player3ID)}</th>
                      <th>{getAccountNameById(scoreList[0]?.Player4ID)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreList.map((score) => (
                      <tr key={score.id}>
                        <td>{score.MatchDate}</td>
                        <td>{score.Player1Score}</td>
                        <td>{score.Player2Score}</td>
                        <td>{score.Player3Score}</td>
                        <td>{score.Player4Score}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ListPage;