import './read_qr_code'
import { generateQrCode, getUserEmail, sendRejectEmail, sendAcceptanceEmail} from './emailing'
import './user_management'

document.addEventListener('DOMContentLoaded', ()=> {
    const userId = document.getElementById('user_id').value;
    const submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', async event => {
        console.log("Submit worked");
        const qrCode = await generateQrCode(userId);
        console.log(qrCode);
        const userEmail = await getUserEmail(userId);
        console.log(userEmail);
        await sendAcceptanceEmail(userEmail, qrCode);
        console.log('Sending email');
    })
})