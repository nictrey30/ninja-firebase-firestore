const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');
// conditional menu links
const setupUI = (user) => {
  // user logged in -> menus: account, logout, create guide
  // user logged out -> menus: login, signup
  if (user) {
    // if user exists, display the account info - email
    if (user.admin) {
      adminItems.forEach((item) => (item.style.display = 'block'));
    }
    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
          <div>Logged in as ${user.email}</div>
          <div>Bio: ${doc.data().bio}</div>
          <div class="pink-text">${user.admin ? 'you are an admin' : ''}</div>
        `;
        accountDetails.innerHTML = html;
      });

    // toggle UI elements
    loggedInLinks.forEach((item) => (item.style.display = 'block'));
    loggedOutLinks.forEach((item) => (item.style.display = 'none'));
  } else {
    // remove the account info if the user is not logged in
    accountDetails.innerHTML = '';
    // toggle UI elements
    loggedInLinks.forEach((item) => (item.style.display = 'none'));
    loggedOutLinks.forEach((item) => (item.style.display = 'block'));
    adminItems.forEach((item) => (item.style.display = 'none'));
  }
};

// setup the guides
const setupGuides = (data) => {
  if (data.length) {
    let html = '';
    data.forEach((doc) => {
      const guide = doc.data();
      // console.log(guide);
      // { title: "Find all the stars in Mario 64", content: "lorem ipsum nit solorem det" }

      const li = `
        <li>
          <div class="collapsible-header grey lighten-4">
            ${guide.title}
          </div>
          <div class="collapsible-body white">
            ${guide.content}
          </div>
        </li>
      `;
      html += li;
    });
    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
  }
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});
