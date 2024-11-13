const dotenv = require('dotenv');
dotenv.config();  

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth'); 

const { FIREBASE_ADMIN_APIKEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } = process.env;

const firebaseConfig = {
  apiKey: FIREBASE_ADMIN_APIKEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

async function decodeToken(token) {
    //return app.getAuth().verifyIdToken(token);
    const auth = getAuth();
    return auth.verifyIdToken(token);
}

async function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];        

    if (!token) {
        return res.status(401).json({ message: 'Token vaaditaan' });
    }

    try {
        const { uid } = decodeToken(token);
        res.locals.userid = uid;
        next();
    } catch (error) {
        console.error('Virhe tokenin tarkastuksessa:', error);
        return res.status(403).json({ message: 'Virheellinen token' });
    }
}

module.exports = { auth };