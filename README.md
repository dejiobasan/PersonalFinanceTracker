# Personal Finance Tracker

## Overview

The Personal Finance Tracker is a web application designed to help users manage their personal finances. Users can track their income and expenses, view transaction history, and analyze their financial data. The application includes features for both regular users and administrators.

## Features

- User Registration and Authentication
- Add, Edit, and Delete Transactions
- View Transaction History
- Filter Transactions by Type (Credit/Debit)
- Admin Dashboard for Managing Users and Transactions
- User Analytics and Admin Analytics

## Technologies Used

- **Frontend**: React, TypeScript, Zustand, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **Icons**: Lucide-react

## Installation

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/PersonalFinanceTracker.git
   cd PersonalFinanceTracker/Backend

   ```

2. Install dependencies:

    npm install

3. Create a .env file in the Backend directory and add the following environment variables:

    MONGO_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_access_token_secret

4. Start the backend server:
    npm run dev


### Frontend Setup

1. Navigate to the Frontend directory:
    cd ../Frontend

2. Install dependencies:
    npm install

3. Start the frontend development server:
    npm run dev

### Usage

1. Open your browser and navigate to http://localhost:5173.
2. Register a new account or log in with an existing account.
3. Use the navigation bar to access different features of the application.
4. Admin users can access the admin dashboard to manage users and transactions.


### Project Structure

Backend
- Routes/: Contains route handlers for different API endpoints.
- Models/: Contains Mongoose models for the database.
- Middleware/: Contains middleware functions for authentication and authorization.

Frontend
-  src/Components/: Contains React components for the application.
- src/Pages/: Contains page components for different views.
- src/Stores/: Contains Zustand stores for state management.

### Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

License
I do not have a license lol.

 
