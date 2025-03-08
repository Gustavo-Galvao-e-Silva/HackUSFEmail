import admin from 'firebase-admin';
import serviceAccount from 'PATH_TO_ADMIN_KEY' assert { type: 'json' }; //Gotta fix this import
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

//Initialize app in admin mode
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore();

//Create the transporter with email info
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: , //Add account email
        pass:  //Need to use app password (need to create HackUSF gamil account and add 2FA)
    }
})

//Generates QR code that embeds user ID 
async function generateQrCode(userID) {
    try {
        const qrCode = await QRCode.toDataURL(userID, {
            errorCorrectionLevel: 'H',
            width: 300,
            height: 300,
            margin: 1
        });

        return qrCode;
    } catch (error) {
        console.error(error);
    }
}

//Updates user status to accepted
async function updateUserStatus(userID) {
    try {
        const data = {
            "status": "accepted",
        }

        await db.collection('users').doc(userID).update(data);
    } catch (error) {
        console.error(error);
    }
}

//Gets user email from user ID to be used in email sending
async function getUserEmail(userID) {
    try {
        const userDoc = await db.doc(`users/${userID}`).get()

        if (!userDoc) {
            throw new Error("User not found");
        }

        const userData = userDoc.data();

        if (!userData.email) {
            throw new Error("User doesn't have email");
        }

        return userData.email;
    } catch (error) {
        console.error(error);
    }
}

//Sends email for those who were accepted with the QR code
async function sendAcceptanceEmail(email, qrCode) {
    try {
        const qrCodeBuffer = Buffer.from(
            qrCode.replace(/^data:image\/png;base64,/, ''),
            'base64'
        );

        //Need to update html to look nice
        const mailMessage = {
            from: 'testaroo17@gmail.com',
            to: email,
            subject: 'Testing Success HackUSF',
            html: `
                <h1>Your QR Code</h1>
                <img src="cid:qrcode" alt="QR Code" />
                <p>Scan this code to access your information.</p>
             `,
            attachments: [{
                filename: 'qrcode.png',
                content: qrCodeBuffer,
                cid: 'qrcode'
            }]
        }

        await transporter.sendMail(mailMessage);
    } catch (error) {
        console.error(error);
    }
}
