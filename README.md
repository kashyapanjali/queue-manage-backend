# Queue-Management-System

A backend API for managing queues and tokens, with authentication for managers.

## Features

- Manager signup/login with JWT authentication
- Create and manage multiple queues
- Add, move, assign, complete, and cancel tokens in queues

## Tech Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- JWT for authentication

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server**
   ```sh
   npm start
   ```
   The server runs on port `5000`.

## API Endpoints

### Auth Routes (`/api/auth`)

- `POST /signup`  
  Register a new manager.  
  **Body:** `{ "username": "string", "password": "string" }`

- `POST /login`  
  Login and receive JWT token.  
  **Body:** `{ "username": "string", "password": "string" }`

- `GET /verify`  
  Verify JWT token.  
  **Header:** `Authorization: Bearer <token>`

### Queue Routes (`/api/queues`)

- `POST /`  
  Create a new queue.  
  **Body:** `{ "name": "string" }`

- `GET /`  
  Get all queues.

- `GET /:id/tokens`  
  Get tokens of a queue.

- `POST /:id/tokens`  
  Add a token to a queue.  
  **Body:** `{ "personName": "string" }`

- `PUT /:id/tokens/:tokenId/move`  
  Move a token up or down in the queue.  
  **Body:** `{ "direction": "up" | "down" }`

- `PUT /:id/assign`  
  Assign the top waiting token to "serving".

- `PUT /:id/complete`  
  Complete the current serving token and auto-assign the next.

- `DELETE /:id/tokens/:tokenId`  
  Cancel a token.

## Project Structure

```
.
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── Queue.js
│   └── User.js
├── routes/
│   ├── authRoute.js
│   └── queueRoute.js
├── package.json
└── .env
```
