# Debt Manager

This project consists of a front page that makes requests for an API Rest. The front was created using React and the back was created using NodeJS.

The idea of the project is to create a page capable of managing the debt of fictitious users taken from the external API jsonplaceholder.

The user from the front or by HTTP requests to the API can create, edit, retrieve and delete debts.

```
OBS: This software is part of a programming test, so everything that has been implemented is fictionalized.
```

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14 or higher

    ```bash
    # determine node version
    node --version
    ```

- [MongoDB](https://www.mongodb.com/) version 4.2

## To execute this code

- Clone the repository

    ```bash
    git clone https://github.com/ederclayton/DebtManagement.git
    ```

- Install modules

    ```bash
    cd frontend/
    npm install
    cd ..
    cd backend/
    npm install
    ```
- Config env file

    ```
    cp .env.example .env
    ```

    Open the newly copied .env file and add the MongoDb access url.

- Start the project
    
    Open two terminals and for each terminal execute the following commands:

    ```bash
    cd backend/
    npm start
    ```

    ```bash
    cd frontend/
    npm start
    ```

    ```
    OBS: Before running, check if the connection to the database is possible.
    ```

## To execute the unit test

    ```bash
    cd backend/
    npm test
    ```

## Routes explanation

### Route POST /debt/:client

#### Description

- This route is responsible for registering a new debt for the past client as a parameter.

#### Parameters

```json
{
    "reason": "A reason about the debt",
    "value": 1000.0,
    "date": "2019-12-21"
}
```

### Route GET /debt/:client/all

#### Description

- This route is responsible for showing all the registered debts of a customer.

#### Return Example

```json
[
    {
        "_id": "5e52f5dedae93e101c21ba65",
        "value": "123",
        "reason": "A reason...",
        "date": "2012-12-01T03:00:00.000Z",
        "clientId": "2"
    },
    {
        "_id": "5e52f8fb561d597ed07bb38b",
        "value": "25",
        "reason": "Another reason...",
        "date": "2020-01-01T03:00:00.000Z",
        "clientId": "2"
    }
]
```

### Route GET /debt/:id

#### Description

- This route is responsible for showing a specific debt according to the debt id passed as a parameter.

#### Return Example

```json
{
    "_id": "5e52f5dedae93e101c21ba65",
    "value": "123",
    "reason": "A reason...",
    "date": "2012-12-01T03:00:00.000Z",
    "clientId": "2"
}
```

### Route PUT /debt/:id

#### Description

- This route is responsible for updating a specific debt according to the debt id passed as a parameter.

#### Parameters

```json
{
    "clientID": "2",
    "reason": "A reason about the debt",
    "value": 1000.0,
    "date": "2019-12-21"
}
```

### Route DELETE /debt/:id

#### Description

- This route is responsible for delete a specific debt according to the debt id passed as a parameter.

#### Parameters

- No parameters are required.
