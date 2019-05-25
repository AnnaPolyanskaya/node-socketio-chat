const  google = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: "960408583269-t3r100j7bkf8293c2u41hhccop8b8ekk.apps.googleusercontent.com", // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: "pSaEP1W2OA8olCgc99gYOMTi", // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'http://localhost:3000/google-auth' // this must match your google api settings
};

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/
/*************/
function createConnection() {
  return new OAuth2Client(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
}
  
/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */

const urlGoogle = function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
const getGoogleAccountFromCode = async function getGoogleAccountFromCode(code) {
  const auth = createConnection();
  try{
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens,
    };
  } catch(error){
    console.log(error)
  }
  
}

module.exports.urlGoogle = urlGoogle;
module.exports.getGoogleAccountFromCode = getGoogleAccountFromCode;
