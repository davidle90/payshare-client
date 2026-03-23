# PayShare Frontend

The PayShare Frontend is a web application for managing shared expenses between groups. It provides an intuitive interface to create groups, track expenses, and view simplified balances. Designed to work with the PayShare NestJS backend.

## Features

- **User Authentication:** Sign up, log in, and manage your account.  
- **Groups Management:** Create and join groups, invite members, and view group details.  
- **Expense Tracking:** Add, edit, and delete expenses within groups.  
- **Simplified Balances:** See who owes whom and the minimized transactions between users.  
- **Responsive UI:** Works on desktop and mobile devices.  
- **Integration with Backend:** Communicates with the PayShare NestJS backend via REST API.

## Tech Stack

- **Frontend Framework:** Vue.js  
- **State Management:** Pinia  
- **Styling:** Tailwind CSS  
- **HTTP Client:** Axios  
- **Backend Integration:** REST API with JWT authentication

## Installation

```bash
# Clone the repository
git clone https://github.com/davidle90/payshare-client.git

# Navigate into the project
cd payshare-client

# Install dependencies
npm install
```

## Configuration

```bash
VITE_PAYSHARE_API_URL=http://localhost:3000
```

## Running the app

```bash
npm run dev
```
The app should now be running at http://localhost:5173 (default Vite port).
