import admin from 'firebase-admin';
//import serviceAccount from 'PATH_TO_ADMIN_KEY' assert { type: 'json' }; //Gotta fix this import


const serviceAccount = {
    "Admin Key": "yeah boii"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //Add storage path
})

const db = admin.firestore();

export default db;