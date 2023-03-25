/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = /* GraphQL */ `
  mutation CreateAccount(
    $input: CreateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    createAccount(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount(
    $input: UpdateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    updateAccount(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount(
    $input: DeleteAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    deleteAccount(input: $input, condition: $condition) {
      id
      name
      description
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
      MatchDate
      matchCount
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
export const updateScore = /* GraphQL */ `
  mutation UpdateScore(
    $input: UpdateScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    updateScore(input: $input, condition: $condition) {
      id
      MatchDate
      matchCount
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
export const deleteScore = /* GraphQL */ `
  mutation DeleteScore(
    $input: DeleteScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    deleteScore(input: $input, condition: $condition) {
      id
      MatchDate
      matchCount
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
