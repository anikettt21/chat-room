// Local Chat functionality - No server required
class LocalChatApp {
  constructor() {
    this.messagesContainer = document.getElementById('messagesContainer');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.userCountElement = document.getElementById('userCount');
    this.username = this.getUsername();
    this.messages = this.loadMessages();
    this.isConnected = true;
    
    this.initializeEventListeners();
    this.displayWelcomeMessage();
    this.loadStoredMessages();
  }

  getUsername() {
    // Get nickname from localStorage
    const savedNickname = localStorage.getItem('nickname') || localStorage.getItem('userNickname');
    return savedNickname ? savedNickname.trim() : `Anonymous${Math.floor(Math.random() * 1000)}`;
  }

  loadMessages() {
    const stored = localStorage.getItem('chatMessages');
    return stored ? JSON.parse(stored) : [];
  }

  saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
  }

  initializeEventListeners() {
    // Send message on button click
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // Send message on Enter key
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Enable/disable send button based on input
    this.messageInput.addEventListener('input', () => {
      this.sendBtn.disabled = !this.messageInput.value.trim();
    });

    // Initial button state
    this.sendBtn.disabled = true;
  }

  sendMessage() {
    const messageText = this.messageInput.value.trim();
    if (!messageText) return;

    // Create message object
    const messageData = {
      id: Date.now(),
      username: this.username,
      message: messageText,
      timestamp: new Date(),
      isMyMessage: true
    };

    // Add to messages array
    this.messages.push(messageData);
    
    // Save to localStorage
    this.saveMessages();
    
    // Display message
    this.addMessage(messageData.username, messageData.message, true, messageData.timestamp);
    
    // Clear input
    this.messageInput.value = '';
    this.sendBtn.disabled = true;

    // Simulate other users responding (for demo purposes)
    this.simulateOtherUsers();
  }

  simulateOtherUsers() {
    const responses = [
      "Nice message! 👍",
      "I agree with that!",
      "Interesting point...",
      "Thanks for sharing!",
      "That's cool! 😎",
      "I'm here too!",
      "Great chat room!",
      "Hello everyone! 👋"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const fakeUsers = ["Rahul", "Priya", "Amit", "Neha", "Vikram", "Sneha"];
    const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];

    // Simulate delay
    setTimeout(() => {
      const messageData = {
        id: Date.now(),
        username: randomUser,
        message: randomResponse,
        timestamp: new Date(),
        isMyMessage: false
      };

      this.messages.push(messageData);
      this.saveMessages();
      this.addMessage(messageData.username, messageData.message, false, messageData.timestamp);
    }, 1000 + Math.random() * 3000); // Random delay between 1-4 seconds
  }

  loadStoredMessages() {
    // Display last 20 messages from localStorage
    const recentMessages = this.messages.slice(-20);
    recentMessages.forEach(msg => {
      this.addMessage(msg.username, msg.message, msg.isMyMessage, msg.timestamp);
    });
  }

  displayWelcomeMessage() {
    this.updateConnectionStatus(`Welcome to Raisoni Gang Chat Room! You are ${this.username} 🎉`);
    this.updateUserCount(1);
  }

  addMessage(username, text, isMyMessage = false, timestamp = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isMyMessage ? 'my-message' : 'other-message'}`;
    
    const time = timestamp ? 
      new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="message-username">${username}</div>
      <div class="message-text">${this.escapeHtml(text)}</div>
      <div class="message-time">${time}</div>
    `;
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  updateConnectionStatus(message) {
    const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.textContent = message;
    }
  }

  updateUserCount(count) {
    this.userCountElement.textContent = `👥 ${count} online`;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Method to clear chat history
  clearChat() {
    this.messages = [];
    this.saveMessages();
    this.messagesContainer.innerHTML = '<div class="welcome-message">Chat cleared! 🗑️</div>';
    this.displayWelcomeMessage();
  }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
  new LocalChatApp();
});
