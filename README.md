This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Prerequisites for Backend

Before setting up the backend, ensure you have the following installed:

- [Go](https://golang.org/dl/) (1.18 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [SQLC](https://sqlc.dev) (for generating Go code from SQL queries)
- [Goose](https://github.com/pressly/goose) (for database migrations)

## Backend Structure

```bash
backend/
   ├── database/                 # SQLC generated database queries
   ├── sql/                      # SQL files for goose migrations
   ├── routes/                   # Route definitions
   ├── controllers/              # Handlers for HTTP requests
   ├── main.go                   # Entry point for the backend server
   |--docker-compose.yml         # Docker Compose configuration
```

## Setup

1. Clone the repository and navigate to the backend directory:

   ```sh
   git clone https://github.com/pelumitegbe/Personal-Finance-Tracker
   cd Personal-Finance-Tracker/backend
   ```

2. Install dependencies:

   ```sh
   go mod tidy
   ```

3. Run docker-compose to setup the database

   ```sh
   docker-compose up -d #"-d" if you want to run docker in a detached mode
   ```

4. Run the database migrations

   ```sh
   goose postgres postgresql://admin:finance123@localhost:5433/finance_tracker up
   ```

5. Compile the go code and run the server

   ```sh
    go build -o financeTracker main.go
    ./financeTracker
   ```

## Routes

### API Routes: Transactions

This document outlines the API routes for handling transactions in our application.

1. Get Transactions

Retrieves a list of transactions.

- **URL:** `/users/transactions`
- **Method:** `GET`
- **Auth required:** No (Not right now but will require later)

#### Success Response

- **Code:** 200 OK
- **Content example:**

```json
[
  {
    "Amount": "100.76",
    "TransactionType": "income",
    "Description": {
      "String": "",
      "Valid": false
    },
    "Category": {
      "String": "",
      "Valid": false
    },
    "TransactionDate": "2024-10-07T00:00:00Z",
    "CreatedAt": "2024-10-08T15:10:02.005001Z",
    "UpdatedAt": "2024-10-08T15:10:02.005001Z"
  },
  {
    "Amount": "100.76",
    "TransactionType": "income",
    "Description": {
      "String": "netflix subscription",
      "Valid": true
    },
    "Category": {
      "String": "subscription",
      "Valid": true
    },
    "TransactionDate": "2024-10-07T00:00:00Z",
    "CreatedAt": "2024-10-08T15:16:13.055464Z",
    "UpdatedAt": "2024-10-08T15:16:13.055465Z"
  }
]
```

#### Error Response

(Once authorization is complete )

- **Code:** 401 UNAUTHORIZED
- **Content:** `{ "error": "Authentication required" }`

OR

- **Code:** 500 INTERNAL SERVER ERROR
- **Content:** `{ "error": "Failed to retrieve transactions" }`

2. Add Transactions

Adds the transactions to the database .

- **URL:** `/users/transactions`
- **Method:** `POST`
- **Auth required:** No (Not right now but will require later)

#### Success Response

- **Code:** 201 OK
- **Content example:**

#### Error Response

(Once authorization is complete )

- **Code:** 401 UNAUTHORIZED
- **Content:** `{ "error": "Authentication required" }`

OR

- **Code:** 500 INTERNAL SERVER ERROR
- **Content:** `{ "error": "Failed to retrieve transactions" }`

OR

- **Code:** 400 STATUS BAD REQUEST
- **Content:** `{ "error": "Request body not valid" }`
