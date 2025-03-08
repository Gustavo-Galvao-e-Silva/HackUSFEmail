import db from './admin_setup'

async function updateUserStatusApproved(userID) {
    try {
        const data = {
            "status": "accepted"
        }

        await db.collection('users').doc(userID).update(data);
    } catch (error) {
        console.error(error);

        throw error;
    }
}

async function updateUserStatusRejected(userID) {
    try {
        const data = {
            "status": "rejected"
        }

        await db.collection('users').doc(userID).update(data);
    } catch (error) {
        console.error(error);

        throw error;
    }
}

async function checkInUser(userID) {
    try {
        const data = {
            "checkedIn": true
        }

        await db.collection('users').doc(userID).update(data);
    } catch (error) {
        console.error(error);

        throw error;
    }
}

function validateUserId(userID) {}//Add validation after scanning