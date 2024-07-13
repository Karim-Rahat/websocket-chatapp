# Chat Application

A real-time chat application using Node.js, WebSocket, and MySQL. This project enables users to connect and exchange messages live while maintaining a history of chats.

## Features

- Real-time messaging using WebSocket.
- Messages are stored in a MySQL database.
- Preloading of messages on connection.
- Simple user interface for chatting.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **WebSocket**: For real-time communication between clients and server.
- **MySQL**: For storing chat messages and user details.
- **Express**: Web framework for Node.js.
- **EJS**: Templating engine for rendering HTML views.

## Getting Started

### Prerequisites

- Node.js
- MySQL
- A `.env` file with the following variables:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_NAME=your_db_name
CORS_ORIGIN=https://your-frontend-domain.com
PORT=4200
