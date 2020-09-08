// listen for auth status changes
auth.onAuthStateChanged((user) => {
  // if the user logged in we will see the user, if the user logged out the value will be null
  if (user) {
    // get data
    db.collection('guides')
      .get()
      .then((snapshot) => {
        setupGuides(snapshot.docs);
        setupUI(user);
      });
  } else {
    setupGuides([]);
    setupUI();
  }
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = signupForm['signup-email'].value.trim();
  const password = signupForm['signup-password'].value.trim();

  // sign up the user with the method of email & pass - it is async
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      // close the signup modal & reset form
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

// logout method
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  // auth.signOut().then(() => {
  //   // console.log('user signed out');
  // });
  auth.signOut();
});

// login users
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // console.log(userCredential);
      // close the login modal & reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch((err) => console.log(err));
});

// when we want to restrict our data to only authenticated users we actually also have to restrict that data on the firestore database itself using security rules
