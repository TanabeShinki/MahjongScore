import React, { useState, useEffect } from "react";
import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { listAccounts } from "./graphql/queries";
import { createAccount } from "./graphql/queries";

const initialFormState = { id: '', name: '',description: ''}

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
    },
  ]);

  // async function AddAccount() {
  //   try{
  //     if (!formData.id || !formData.name || !formData.description) return;
  //     alert(formData.id)
  //     await API.graphql({ query: createAccount, variables: { input: formData } });
  //     setFormData(initialFormState);
  //   }catch(error){
  //     console.error(error);
  //   }
  // }
  async function AddAccount() {
    try{
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
    }catch(error){
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
  //   const apiData = await API.graphql({ query: listAccounts });
  //   setAccountList(apiData.data.listAccounts.items);
  // }

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleInputChange(index, event) {
    const newInputSets = [...inputSets];
    newInputSets[index][event.target.name] = event.target.value;

    const filledValues = ["value1", "value2", "value3", "value4"].filter(
      (key) => newInputSets[index][key] !== ""
    );

    if (filledValues.length === 3) {
      const emptyValueKey = ["value1", "value2", "value3", "value4"].find(
        (key) => newInputSets[index][key] === ""
      );

      const sum = filledValues.reduce(
        (acc, key) => acc + parseFloat(newInputSets[index][key]),
        0
      );

      newInputSets[index][emptyValueKey] = -sum;
    }

    setInputSets(newInputSets);
  }

  function InputDB() {
    alert(accountList);
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

   return (
    <div className="App">
      <h1>Mahjong Score Input</h1>
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
              <td>{index === 0 ? '' : `${inputSet.date} Match ${inputSet.matchCount}`}</td>
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
                      name={key}
                      value={inputSet[key]}
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
      <button onClick={handleAddInputSet} style={{ marginTop: '10px' }}>
        Add More Input Set
      </button>
      <button onClick={signOut} style={{ marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}>
        Sign out
      </button>
      <button onClick={InputDB} style={{ marginTop: '10px' }}>
        Registration
      </button>
      <h1>Create Account</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="name"
        value={formData.name}
      />
      <button onClick={AddAccount}>Create Account</button>


    </div>
  );
}
 
export default withAuthenticator(App);
