const functions = require('firebase-functions');
const admin = require('firebase-admin');
// initialize the app server-side
admin.initializeApp();
// admin - reach out to the auth service and get users or set custom claims

// create function that will make a specific user an admin
// onCall - we can call this function from the front-end
exports.addAdminRole = functions.https.onCall;
