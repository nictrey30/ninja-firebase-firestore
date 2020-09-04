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
    this.unsub;
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
  // set up a real-time listener which is gonna return a response every time there is a change
  getChats(callback) {
    this.unsub = this.chats
      .where('room', '==', this.room)
      .orderBy('created_at')
      .onSnapshot((snapshot) => {
        // get the document changes from snapshot
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            // update the UI
            callback(change.doc.data());
          }
        });
      });
  }
  // update the username
  updateName(username) {
    this.username = username;
    localStorage.setItem('username', username);
  }
  updateRoom(room) {
    // unsubscribe from the real-time listener, because it is currently listening to the old room
    this.room = room;
    console.log('room updated');
    if (this.unsub) {
      this.unsub();
    }
  }
}
