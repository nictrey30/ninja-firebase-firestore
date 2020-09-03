// adding new chat documents to the chats collection
// setting up real time listener to get new chats
// updating the username, when the user types the name into the form
// updating the room, when the user clicks on a room

class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    // reference to the chats collection in the database
    this.chats = db.collection('chats');
  }
  async addChat(message) {
    // construct a chat object
    const now = new Date();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    // save the chat document
    const response = await this.chats.add(chat);
    return response;
  }
}

const chatroom = new Chatroom('gaming', 'shaun');
// chatroom
//   .addChat('hello everyone')
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
