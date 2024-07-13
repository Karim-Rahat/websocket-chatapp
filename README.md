# Chat Application

A real-time chat application using **Node.js**, **WebSocket**, and **MySQL**. This project enables users to connect and exchange messages live while maintaining a history of chats.

## Features

- **Real-time messaging** using WebSocket.
- **Messages stored** in a MySQL database.
- **Preloading of messages** on connection.
- **Simple user interface** for chatting.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **WebSocket**: For real-time communication between clients and server.
- **MySQL**: For storing chat messages and user details.
- **Express**: Web framework for Node.js.
- **EJS**: Templating engine for rendering HTML views.

## Getting Started

### Prerequisites

- **Node.js**
- **MySQL**
- A `.env` file with the following variables:

    ```env
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_NAME=your_db_name
    CORS_ORIGIN=https://your-frontend-domain.com
    PORT=4200
    ```

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Karim-Rahat/websocket-chatapp.git
    cd websocket-chatapp
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the application:**

    ```bash
    npm start
    ```

   Alternatively, you can use **PM2** for process management:

    ```bash
    pm2 start app.js --name chat-application
    pm2 save
    ```

## Usage

Access the application by navigating to `http://localhost:4200` in your web browser. Make sure to replace `localhost` with your server's IP or domain if you're deploying it on a server.

### WebSocket Connection

The application uses WebSocket to manage real-time communication. Ensure that your WebSocket server URL is set correctly in the client-side code.

## Important Code Sections

### Heartbeat

To maintain the WebSocket connection, a heartbeat mechanism is implemented:

```javascript
const t = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
        clearInterval(t);
        return;
    }
    console.log('ping');
    ws.send(JSON.stringify({ type: "ping" }));
}, 55000);
```
### License
This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgements
Express for the web framework
WebSocket for real-time communication
MySQL for database management
PM2 for process management
