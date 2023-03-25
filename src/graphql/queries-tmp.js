/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = /* GraphQL */ `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createAccount = /* GraphQL */ `
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      description
    }
  }
  `;

export const getScore = /* GraphQL */ `
  query GetScore($id: ID!) {
    getScore(id: $id) {
      id
      Player1ID
      Player2ID
      Player3ID
      Player4ID
      Player1Score
      Player2Score
      Player3Score
      Player4Score
      firstplace
      secondplace
      thirdplace
      fourthplace
      createdAt
      updatedAt

    }
  }
`;



export const createScore = /* GraphQL */ `
  mutation CreateScore(
    $input: CreateScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    createScore(input: $input, condition: $condition) {
      id
      Player1ID
      Player2ID
      Player3ID
      Player4ID
      Player1Score
      Player2Score
      Player3Score
      Player4Score
      firstplace
      secondplace
      thirdplace
      fourthplace

    }
  }
  `;

export const listScores = /* GraphQL */ `
  query ListScores(
    $filter: ModelScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Player1ID
        Player2ID
        Player3ID
        Player4ID
        Player1Score
        Player2Score
        Player3Score
        Player4Score
        firstplace
        secondplace
        thirdplace
        fourthplace
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
