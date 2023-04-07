import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Form, Table } from 'react-bootstrap';
import { listScores, listAccounts } from "./graphql/queries";
import { useNavigate } from "react-router-dom";

function ScoreList({ signOut, user }) {
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

  function getWinnerCounts() {
    const winnerCounts = {};

    scores.forEach((score) => {
      if (winnerCounts[score.firstplace]) {
        winnerCounts[score.firstplace] += 1;
      } else {
        winnerCounts[score.firstplace] = 1;
      }
    });

    return winnerCounts;
  }

  function getTopWinners() {
    const winnerCounts = getWinnerCounts();

    const topWinners = Object.keys(winnerCounts).sort((a, b) => {
      return winnerCounts[b] - winnerCounts[a];
    });

    return topWinners;
  }

  function getAccountName(accountId) {
    const account = accounts.find((account) => account.id === accountId);
    return account ? account.name : "";
  }

  function renderGraph() {
    const topWinners = getTopWinners();
    const winnerCounts = getWinnerCounts();

    return (
      <div>
        <h3>勝利回数ランキング</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>順位</th>
              <th>アカウント名</th>
              <th>勝利回数</th>
            </tr>
          </thead>
          <tbody>
            {topWinners.map((winner, index) => (
              <tr key={winner}>
                <td>{index + 1}</td>
                <td>{getAccountName(winner)}</td>
                <td>{winnerCounts[winner]}</td>
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

export default ScoreList;
