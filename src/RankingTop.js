import React from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function ScoreAnalysisTop() {
    const navigate = useNavigate();
    return (
        <Container>
            <Row>
                <Col>
                    <div className="List text-center my-3">
                        <h1 className="mt-5 text-center">ランキングトップページ</h1>

                        <div className="text-center">
                            <Button variant="info" onClick={() => navigate('/')} className="mx-2">対局データの入力ページ</Button>
                            <Button variant="info" onClick={() => navigate('/List')}  className="mx-2">対局データ一覧</Button>
                        </div>
                        
                        <div className="text-center my-3">
                            <Button variant="secondary" onClick={() => navigate('/TotalTopRanking')}>勝利回数ランキング</Button>
                        </div>

                        <div className="text-center my-3">
                            <Button variant="secondary" onClick={() => navigate('/TotalScoreRanking')}>合計得点ランキング</Button>
                        </div>


                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ScoreAnalysisTop;
