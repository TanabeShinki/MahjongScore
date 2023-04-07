import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Form, Table } from 'react-bootstrap';
import { listScores, listAccounts } from "./graphql/queries";
import { useNavigate } from "react-router-dom";

function TotalScoreRanking({ signOut, user }) {
  const [scores, setScores] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  async function fetchScores() {
    try {
      const apiData = await API.graphql({ query: listScores });
      const scoresFromAPI = apiData.data.listScores.items;
      setScores(scoresFromAPI);
    } catch (error) {
      console.log("error fetching scores", error);
    }
  }

  async function fetchAccounts() {
    try {
      const apiData = await API.graphql({ query: listAccounts });
      const accountsFromAPI = apiData.data.listAccounts.items;
      setAccounts(accountsFromAPI);
    } catch (error) {
      console.log("error fetching accounts", error);
    }
  }

  useEffect(() => {
    fetchScores();
    fetchAccounts();
  }, []);

  function getTotalScores() {
    const totalScores = {};
  
    scores.forEach((score) => {
      const player1Score = parseInt(score.Player1Score, 10);
      const player2Score = parseInt(score.Player2Score, 10);
      const player3Score = parseInt(score.Player3Score, 10);
      const player4Score = parseInt(score.Player4Score, 10);
  
      if (totalScores[score.Player1ID]) {
        totalScores[score.Player1ID] += player1Score;
      } else {
        totalScores[score.Player1ID] = player1Score;
      }
  
      if (totalScores[score.Player2ID]) {
        totalScores[score.Player2ID] += player2Score;
      } else {
        totalScores[score.Player2ID] = player2Score;
      }
  
      if (totalScores[score.Player3ID]) {
        totalScores[score.Player3ID] += player3Score;
      } else {
        totalScores[score.Player3ID] = player3Score;
      }
  
      if (totalScores[score.Player4ID]) {
        totalScores[score.Player4ID] += player4Score;
      } else {
        totalScores[score.Player4ID] = player4Score;
      }
    });
  
    return totalScores;
  }
  

  function getTopScores() {
    const totalScores = getTotalScores();

    const topScores = Object.keys(totalScores).sort((a, b) => {
      return totalScores[b] - totalScores[a];
    });
    // alert(totalScores[0])
    // alert(topScores[1])
    // alert(totalScores[0])
    // alert(topScores[1])

    return topScores;
  }

  function getAccountName(accountId) {
    const account = accounts.find((account) => account.id === accountId);
    return account ? account.name : "";
  }

  function renderGraph() {
    const topScores = getTopScores();
    const totalScores = getTotalScores();

    return (
      <div>
        <h3>合計得点ランキング</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>順位</th>
              <th>アカウント名</th>
              <th>合計得点</th>
            </tr>
          </thead>
          <tbody>
            {topScores.map((accountId, index) => (
              <tr key={accountId}>
                <td>{index + 1}</td>
                <td>{getAccountName(accountId)}</td>
                <td>{totalScores[accountId]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }


  
  return (
    <Container>
      <h1 className="mt-5 text-center">麻雀スコア分析ページ</h1>
      <div className="text-center my-3">
        <Button variant="primary" onClick={() => navigate('/')}>
          対局データの入力ページに戻る
        </Button>
        <Button variant="danger" onClick={signOut} className="mx-2">
          Sign out
        </Button>
      </div>
      {renderGraph()}
    </Container>
  );
}

export default TotalScoreRanking;
