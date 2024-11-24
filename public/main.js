const socket = io();
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

socket.on('loadMessages', (messages) => {
  messages.forEach((msg) => addMessage(msg));
});

socket.on('receiveMessage', (data) => {
  addMessage(data);
});

sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim()) {
    const data = { text: message, sender: 'user', timestamp: new Date().toLocaleTimeString() };
    addMessage(data);
    socket.emit('sendMessage', data);
    messageInput.value = '';
  }
});

function addMessage(data) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', data.sender === 'user' ? 'user' : 'other');

  const bubbleElement = document.createElement('div');
  bubbleElement.classList.add('bubble');
  bubbleElement.textContent = data.text;

  messageElement.appendChild(bubbleElement);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
