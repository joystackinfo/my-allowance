# MyAllowance

MyAllowance is a personal allowance tracker built with a React frontend and an Express/MongoDB backend. It helps users record income and expenses, track savings goals, and monitor weekly spending.

## Features

- User signup, login, and profile management
- Add income and expense transactions
- Delete transactions and filter by income/expense
- Savings goal creation and progress tracking
- Weekly summary and reports page with spending breakdown
- Choose whether your week starts on Sunday or Monday in Profile
- Mobile responsive UI and 404 page support
- Password reset support via email token

## Tech stack

- Frontend: React, React Router, Recharts, CSS modules
- Backend: Express, MongoDB, Mongoose, JWT auth
- Email: Nodemailer

## Folder Structure

```text
myallowance/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   └── goal.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── transaction.model.js
│   │   └── goal.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   └── goal.routes.js
│   ├── .env
│   ├── .gitignore
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── BrokeAlert.jsx
        │   ├── TransactionCard.jsx
        │   ├── AddTransactionModal.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── useAuth.js
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── ForgotPassword.jsx
        │   ├── ResetPassword.jsx
        │   ├── Dashboard.jsx
        │   ├── Transactions.jsx
        │   ├── Reports.jsx
        │   ├── Savings.jsx
        │   ├── Profile.jsx
        │   └── NotFound.jsx
        ├── App.js
        ├── App.css
        └── index.js
```

## API reference

### Auth
- `POST /api/auth/signup` — create a new user
- `POST /api/auth/login` — authenticate and receive a JWT
- `PUT /api/auth/update` — update user profile (protected)
- `POST /api/auth/forgot-password` — request password reset link
- `PUT /api/auth/reset-password/:token` — reset password with token

### Transactions
- `GET /api/transactions` — fetch all user transactions (protected)
- `POST /api/transactions` — add a new transaction (protected)
- `PUT /api/transactions/:id` — update a transaction (protected)
- `DELETE /api/transactions/:id` — delete a transaction (protected)
- `GET /api/transactions/weekly` — fetch weekly transactions (protected)
- `GET /api/transactions/summary` — fetch weekly summary data (protected)

### Goals
- `GET /api/goals` — fetch savings goals (protected)
- `POST /api/goals` — create a new savings goal (protected)
- `POST /api/goals/:id/add-money` — add money to a goal (protected)
- `DELETE /api/goals/:id` — delete a goal (protected)

## Setup

### Backend

1. `cd backend`
2. `npm install`
3. create a `.env` file with:
   - `MONGODB_URI`
   - `PORT`
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL`
4. `npm start`

> If you are at the project root, run:
> `cd backend && npm start`
>
> Do not run `node server.js` from the project root, because the backend entrypoint is inside `backend/`.

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm start`

## Build

From the frontend folder:

```bash
npm run build
```

## App vision

The app is focused on helping students and young earners manage a weekly allowance, stay aware of spending, and build simple savings habits.

