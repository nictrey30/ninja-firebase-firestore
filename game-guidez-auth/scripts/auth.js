// listen for auth status changes
auth.onAuthStateChanged((user) => {
  // console.log(user);
  // if the user logged in we will see the user, if the user logged out the value will be null
  if (user) {
    // get data
    db.collection('guides').onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
        // toggles the conditional nav links if the user is logged in or not
        setupUI(user);
      },
      (err) => console.log(err.message)
    );
  } else {
    setupGuides([]);
    setupUI();
  }
});

// async method for adding a guide
const addGuide = async (title, content) => {
  // construct a guide object
  const guide = {
    title,
    content
  };
  // save the guide document
  const response = await db.collection('guides').add(guide);
  return response;
};

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = createForm.title.value;
  const content = createForm.content.value;
  addGuide(title, content)
    .then((response) => {
      console.log(response, ' ', 'guide added');
      // close the signup modal & reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
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
      return db
        .collection('users')
        .doc(userCredentials.user.uid)
        .set({
          bio: signupForm['signup-bio'].value
        })
        .then(() => {
          // close the signup modal & reset form
          const modal = document.querySelector('#modal-signup');
          M.Modal.getInstance(modal).close();
          signupForm.reset();
        });
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
