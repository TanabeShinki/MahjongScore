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
        <br></br>
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
      <h1 className="mt-5 text-center">合計スコアランキング</h1>
        <div className="mt-2 text-center">
          <Button variant="info" onClick={() => navigate('/')} className="mx-2">対局データの入力ページ</Button>
          <Button variant="info" onClick={() => navigate('/List')} className="mx-2">対局データ一覧</Button>
          <Button variant="info" onClick={() => navigate('/RankingTop')} className="mx-2">ランキングトップ</Button>
        </div>
        <div className="mt-2 text-center">
          <Button variant="secondary" onClick={() => navigate('/TotalTopRanking')} className="mx-2">トータルトップランキング</Button>
        </div>
      {renderGraph()}
    </Container>
  );
}

export default TotalScoreRanking;
