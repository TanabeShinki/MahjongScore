import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap';
import { listAccounts } from "./graphql/queries";

function ListPage(){
    const [accountList, setAccountList] = useState([]);
    const navigate = useNavigate() 
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






    return (
        <div className="List">
            <h1>Mahjong Score List</h1>

            <Button variant="secondary" onClick={() => navigate('/')}>入力画面に戻ルよ</Button>
        </div>
    )
}
export default ListPage