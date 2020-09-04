// render chat templates to the dom
// clear the list of chats when the room changes
class ChatUI {
  constructor(list) {
    // the list is where we are outputing the template to
    this.list = list;
  }
  clear() {
    this.list.innerHTML = '';
  }
  // create a html template for the chat list and output the data to the DOM
  render(data) {
    const when = dateFns.distanceInWordsToNow(data.created_at.toDate(), {
      addSuffix: true
    });
    const html = `
      <li class="list-group-item">
        <span class="username">${data.username}:</span>
        <span class="message">${data.message}</span>
        <div class="time">${when}</div>
      </li>
    `;
    this.list.innerHTML += html;
  }
}
