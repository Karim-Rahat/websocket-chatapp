document.addEventListener('DOMContentLoaded', (event) => {
    // Establish a WebSocket connection
    const socket = new WebSocket('wss://chat.ezwaynetwork.com'); // Ensure this URL is correct

    // WebSocket heartbeat to keep the connection alive
    socket.onopen = function () {
        var t = setInterval(function(){
            if (socket.readyState != 1) {
                clearInterval(t);
                return;
            }
            console.log('ping');
            socket.send('{type:"ping"}');
        }, 55000);
    };

    // Retrieve query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('userid');
    const pId = queryParams.get('pid');
    const displayName = queryParams.get('display_name');
    const email = queryParams.get('email');

    // Get DOM elements
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const messagesContainer = document.getElementById('messages-container');
    const userName = document.getElementById('userName');

    // Set display name if available
    if (displayName) {
        userName.innerText = displayName;
    }

    // Handle form submission to send messages
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            const msg = {
                user_id: userId || '0',
                pid: pId || '0',
                name: displayName || 'test user',
                email: email || 'test@gmail.com',
                message: input.value,
                timestamp: new Date().toISOString()
            };
            socket.send(JSON.stringify(msg));
            input.value = ''; // Clear the input field after sending the message
        }
    });

    // WebSocket event listeners
    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection established.');
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });

    socket.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);
        let currentPid = pId || 0; // Use current `pid` from the URL or default to 0

        if (msg.type === 'preload-messages') {
            // Preload messages from the server
            msg.data.forEach(message => {
                if (message.pid == currentPid) {
                    addMessageToDOM(message);
                }
            });
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
        } else if (msg.type === 'chat-message') {
            // Handle new chat messages
            if (msg.data.pid == currentPid) {
                addMessageToDOM(msg.data);
                messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
            }
        }
    });

    // Function to add a message to the DOM
    function addMessageToDOM(msg) {
        const item = document.createElement('li');
        const messageHeader = document.createElement('div');
        const userName = document.createElement('span');
        const timeStamp = document.createElement('span');
        const messageText = document.createElement('span');

        // Set message header (username and timestamp)
        userName.classList.add('user-name');
        userName.textContent = msg.name;

        timeStamp.classList.add('message-timestamp');
        timeStamp.textContent = new Date(msg.timestamp).toLocaleTimeString();

        messageHeader.classList.add('message-header');
        messageHeader.appendChild(userName);
        messageHeader.appendChild(timeStamp);

        // Set message text
        messageText.classList.add('message-text');
        messageText.textContent = msg.message;

        // Style the message based on the sender
        if (msg.email === email) {
            item.classList.add('from-me');
        } else {
            item.classList.add('from-them');
        }

        item.appendChild(messageHeader);
        item.appendChild(messageText);

        messages.appendChild(item); // Add the message to the DOM
    }
});
