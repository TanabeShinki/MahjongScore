import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import '@aws-amplify/ui-react/styles.css';
import { Form , Button ,Container, Row, Col } from 'react-bootstrap';
import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { listAccounts, listScores } from "./graphql/queries";
import { createAccount, createScore } from "./graphql/queries";
import { useNavigate } from "react-router-dom";

const initialFormState = { id: '', name: '', description: '' }

function App({ signOut, user }) {

  const [accountList, setAccountList] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [inputSets, setInputSets] = useState([
    {
      date: getToday(),
      matchCount: 0,
      accountId1: "",
      accountId2: "",
      accountId3: "",
      accountId4: "",
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      firstplace: " ",
      secondplace: " ",
      thirdplace: " ",
      fourthplace: " "
    },
  ]);

  async function AddAccount() {
    try {
      if (!formData.name) return;
      const maxId = Math.max(...accountList.map(account => Number(account.id)))
      const id = maxId + 1
      const newAccount = {
        id: id.toString(),
        name: formData.name,
        description: getToday() + "に追加"
      }
      await API.graphql({ query: createAccount, variables: { input: newAccount } });
      // フォームをリセット
      setFormData(initialFormState);

      // アカウントリストを再読み込み
      fetchAccounts();
    } catch (error) {
      console.error(error);
    }
  }

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

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleInputChange(index, event) {
    const newInputSets = [...inputSets];

    // 1行目で選択されたアカウントIDをinputSetsに格納
    if (index === 0) {
      newInputSets[index][event.target.name] = event.target.value;
    }

    // 2行目以降はスコアをinputSetsに格納
    if (index !== 0) {
      const accountIdKey = `accountId${event.target.name.slice(-1)}`;
      newInputSets[index][event.target.name] = event.target.value;
      newInputSets[index][accountIdKey] = newInputSets[0][accountIdKey];
    }

    setInputSets(newInputSets);
  }

  async function InputDB() {
    try {
      for (let i = 1; i < inputSets.length; i++) {
        const values = [
          Number(inputSets[i].value1),
          Number(inputSets[i].value2),
          Number(inputSets[i].value3),
          Number(inputSets[i].value4),
        ];
        const sortedValues = values.sort((a, b) => b - a);
        const firstplace = inputSets[i][`accountId${values.indexOf(sortedValues[0]) + 1}`];
        const secondplace = inputSets[i][`accountId${values.indexOf(sortedValues[1]) + 1}`];
        const thirdplace = inputSets[i][`accountId${values.indexOf(sortedValues[2]) + 1}`];
        const fourthplace = inputSets[i][`accountId${values.indexOf(sortedValues[3]) + 1}`];
  
        const data = {
          MatchDate: inputSets[i].date.toString(),
          matchCount: inputSets[i].matchCount,
          Player1ID: inputSets[i].accountId1.toString(),
          Player2ID: inputSets[i].accountId2.toString(),
          Player3ID: inputSets[i].accountId3.toString(),
          Player4ID: inputSets[i].accountId4.toString(),
          Player1Score: inputSets[i].value1,
          Player2Score: inputSets[i].value2,
          Player3Score: inputSets[i].value3,
          Player4Score: inputSets[i].value4,
          firstplace: firstplace,
          secondplace: secondplace,
          thirdplace: thirdplace,
          fourthplace: fourthplace
        };
  
        await API.graphql({ query: createScore, variables: { input: data } });
      }
      console.log("Score added successfully!");
      alert("スコアの登録が完了しました！")
    } catch (err) {
      console.log("Error adding score:", err);
    }
  }
  


  function handleAddInputSet() {
    const newMatchCount = inputSets[inputSets.length - 1].matchCount + 1;
    const newInputSet = {
      date: getToday(),
      matchCount: newMatchCount,
      accountId1: "",
      accountId2: "",
      accountId3: "",
      accountId4: "",
      value1: "",
      value2: "",
      value3: "",
      value4: "",
    };
    setInputSets([...inputSets, newInputSet]);
  }

  const navigate = useNavigate()

  return (
    <Container>
      <h1 className="mt-5 text-center">麻雀スコア入力ページ </h1>
      <Row className="my-3">
        <Col>
          <table className="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Player 3</th>
                <th>Player 4</th>
              </tr>
            </thead>

            <tbody>
              {inputSets.map((inputSet, index) => (
                <tr key={index}>
                  <td>
                    {index === 0
                      ? ''
                      : `${inputSet.date} Match ${inputSet.matchCount}`}
                  </td>
                  {['accountId1', 'accountId2', 'accountId3', 'accountId4'].map((key) => (
                    <td key={key}>
                      {index === 0 ? (
                        <Form.Control
                          as="select"
                          name={key}
                          value={inputSet[key]}
                          onChange={(event) => handleInputChange(index, event)}
                        >
                          <option value="">Select Account</option>
                          {accountList.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name}
                            </option>
                          ))}
                        </Form.Control>
                      ) : (
                        <Form.Control
                          type="number"
                          name={`value${key.slice(-1)}`}
                          value={inputSet[`value${key.slice(-1)}`]}
                          onChange={(event) => handleInputChange(index, event)}
                          aria-label={`Score ${key.slice(-1)}`}
                        />

                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
          <div className="text-center my-3">
            <Button variant="primary" onClick={handleAddInputSet}>
              新しい対局データを入力
            </Button>
            <Button variant="success" onClick={InputDB} className="mx-2">
              対局データの登録
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="mt-5 text-center">アカウント登録</h2>
          <Form.Control
            className="my-3"
            onChange={(e) => setFormData({ ...formData, 'name': e.target.value })}
            placeholder="name"
            value={formData.name}
          />
          <div className="text-center my-3">
            <Button variant="primary" onClick={AddAccount}>
              登録
            </Button>
          </div>
        </Col>
      </Row>

      <div className="text-center">
        <Button variant="info" onClick={() => navigate('/List')}  className="mx-2">
          対局データ一覧の検索
        </Button>
        <Button variant="info" onClick={() => navigate('/Analysis')}  className="mx-2">
          対局データの分析
        </Button>
        <Button variant="danger" onClick={signOut} className="mx-2">
              Sign out
        </Button>
      </div>
    </Container>
  );
}

export default withAuthenticator(App);