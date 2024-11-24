const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-config.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-project-id>.firebaseio.com'
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let messages = [];

io.on('connection', (socket) => {
  console.log('User connected');

  socket.emit('loadMessages', messages);

  socket.on('sendMessage', (data) => {
    messages.push(data);

    const db = admin.database().ref('messages');
    db.push(data);

    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
