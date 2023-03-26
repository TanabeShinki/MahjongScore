import React, { useState, useEffect } from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import '@aws-amplify/ui-react/styles.css';
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
          firstplace: inputSets[i].firstplace,
          secondplace: inputSets[i].secondplace,
          thirdplace: inputSets[i].thirdplace,
          fourthplace: inputSets[i].fourthplace
        };

        await API.graphql({ query: createScore, variables: { input: data } });
      }
      console.log("Score added successfully!");
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
    <div className="App">
      <h1 align="center">Mahjong Score Input</h1>
      <table align="center">
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
                    <select
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
                    </select>
                  ) : (
                    <input
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
      <button align="center" onClick={handleAddInputSet} style={{ marginTop: '10px' }}>
        Add More Input Set
      </button>
      <button align="center" onClick={signOut} style={{ marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}>
        Sign out
      </button>
      <button align="center" onClick={InputDB} style={{ marginTop: '10px' }}>
        Registration
      </button>
      <h1 align="center">Create Account</h1>
      <input align="center"
        onChange={e => setFormData({ ...formData, 'name': e.target.value })}
        placeholder="name"
        value={formData.name}
      />
      <button align="center" onClick={AddAccount}>Create Account</button>
      <div>
        <button align="center" onClick={() => navigate('/List')}>画面遷移します！</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);