const functions = require('firebase-functions');
const admin = require('firebase-admin');
// initialize the app server-side
admin.initializeApp();
// admin - reach out to the auth service and get users or set custom claims

// create function that will make a specific user an admin
// onCall - we can call this function from the front-end

// data is gonna include any custom data that we send along with this call to the function
// context - contains information about the authentication of the user that made this call to the function

// get the user and add a custom claim to the user (admin)
exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by an admin
  if (context.auth.token.admin !== true) {
    return {
      error: 'only admins can add other admins'
    };
  }
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`
      };
    })
    .catch((err) => console.log(err.message));
});

// exports.addAdminRole = functions.https.onCall(async (data, context) => {
//   // get the user and add a custom claim to the user (admin)
//   try {
//     const user = await admin.auth().getUserByEmail(data.email);
//     await admin.auth().setCustomUserClaims(user.uid, {
//       admin: true
//     });
//     return {
//       message: `Success! ${data.email} has been made an admin`
//     };
//   } catch (err) {
//     return console.log(err.message);
//   }
// });
