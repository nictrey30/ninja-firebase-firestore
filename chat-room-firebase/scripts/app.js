// dom queries
const chatList = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMessage = document.querySelector('.update-msg');
const rooms = document.querySelector('.chat-rooms');

// add a new chat
newChatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = newChatForm.message.value.trim();
  // addChat is an async function, and async functions always return a Promise
  chatroom
    .addChat(message)
    .then(() => newChatForm.reset())
    .catch((err) => console.log(err));
});

// update username
newNameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newName = newNameForm.name.value.trim();
  // update name with chatroom's class method
  chatroom.updateName(newName);
  newNameForm.reset();
  // show then hide the update message
  updateMessage.innerText = `
    Your name was updated to: ${newName}
  `;
  setTimeout(() => {
    updateMessage.innerText = '';
  }, 3000);
});

// update the chat room
rooms.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    chatUI.clear();
    chatroom.updateRoom(e.target.id); // chatroom unsubscribes from the real-time event listener when updateRoom()
    chatroom.getChats((chat) => {
      chatUI.render(chat);
    });
  }
});

// check localStorage for a name
let name = localStorage.getItem('username')
  ? localStorage.getItem('username')
  : 'anonymus';

// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('general', name);

// get the chats and render
chatroom.getChats((data) => chatUI.render(data));
