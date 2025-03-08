import db from './admin_setup'
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testaroo17@gmail.com',
        pass: 'jjqa csic gzkv alti'
    }
})

async function generateQrCode(userID) {
    try {
        const qrCode = await QRCode.toDataURL(userID, {
            errorCorrectionLevel: 'H',
            width: 400,
            height: 400,
            margin: 1
        });

        return qrCode;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

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

        throw error;
    }
}

async function sendAcceptanceEmail(email, qrCode) {
    try {
        const qrCodeBuffer = Buffer.from(
            qrCode.replace(/^data:image\/png;base64,/, ''),
            'base64'
        );

        const mailMessage = {
            from: 'testaroo17@gmail.com',
            to: email,
            subject: 'You Were Accepted',
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

        throw error;
    }
}

async function sendRejectEmail(email) {
    try {
        const mailMessage = {
            from: 'testaroo17@gmail.com',
            to: email,
            subject: 'You Were Rejected',
            html: `
                <h1>You were rejected lol</h1>
                <p>No qr code</p>
             `
        }

        await transporter.sendMail(mailMessage);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { generateQrCode, getUserEmail, sendRejectEmail, sendAcceptanceEmail }