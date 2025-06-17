# XWire

A simple banking backend server built with Node.js, Express, TypeScript, and PostgreSQL (TypeORM). It provides authentication, wallet management, and transaction history APIs.

## Features

- User authentication (register, login, logout, get user info)
- Wallet management (view balance, transfer, deposit, withdraw)
- Transaction history
- Secure with CORS and Helmet
- Input validation and error handling

## Tech Stack

- Node.js, Express
- TypeScript
- PostgreSQL (via TypeORM)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fortuneehis/xwire
   cd xwire
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables:**
   This project uses [`proenv`](https://www.npmjs.com/package/proenv) (An NPM package I built) for structured environment variable management. Create a `.env` file in the root directory of the project with the following content:

   ```env
ORIGIN=http://localhost:3000
DB=[
    USERNAME=user
    PASSWORD=user
    NAME=bank
]
APP=[
    STATUS=development
]

COOKIE=[
    DOMAIN=
    NAME=auth_token
]

CURRENCIES=[
    NAIRA=[
        PRECISION=2
        CURRENCY=NGN
    ]
]
```

   Alternatively, you can set these variables directly in your environment.

4. **Run the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Build and start for production:**
   ```bash
   yarn build && yarn start
   # or
   npm run build && npm start
   ```

## API Endpoints

### Auth
- `POST /auth/login` — Login
- `POST /auth/register` — Register
- `GET /auth/user` — Get current user (auth required)
- `POST /auth/logout` — Logout (auth required)

### Wallets
- `GET /wallets/` — Get wallet info (auth required)
- `POST /wallets/transfer` — Transfer funds (auth + pin required)
- `POST /wallets/withdraw` — Withdraw funds (auth required)
- `POST /wallets/deposit` — Deposit funds (auth required)

### Transactions
- `GET /transactions/` — List all transactions (auth required)

## Scripts

- `yarn dev` — Start in development mode with hot reload
- `yarn build` — Compile TypeScript
- `yarn start` — Run compiled server

## License

MIT 