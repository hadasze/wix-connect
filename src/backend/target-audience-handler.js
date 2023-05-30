import { mediaManager } from 'wix-media-backend';
import { getIsContactedUser } from './data-methods.js'
const { Parser } = require('json2csv');

export async function getDownloadCsvUrlFromArray(array, fileName) {
    const fields = Object.keys(array[0]);
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(array);
        const buf = Buffer.from(csv, 'utf8');
        const uploadedFile = await uploadFile(buf, fileName);
        return await getPublicDownloadUrl(uploadedFile.fileUrl);
    } catch (err) {
        console.error(err);
    }
}

function uploadFile(buffer, fileName) {
    return mediaManager.upload(
        "/myUploadFolder/subfolder",
        buffer,
        `${fileName}.csv`, {
        "mediaOptions": {
            "mimeType": "application/vnd.ms-excel",
            "mediaType": "document"
        },
        "metadataOptions": {
            "isPrivate": true,
            "isVisitorUpload": false,
            "context": {
                "someKey1": "someValue1",
                "someKey2": "someValue2"
            }
        }
    }
    );
}

async function getPublicDownloadUrl(fileUrl) {
    const myFileDownloadUrl = await mediaManager.getDownloadUrl(fileUrl);
    return myFileDownloadUrl;
}

export async function filterAudience(audienceDetails) {
    const approved = [];
    const needAprroval = [];
    const rejected = [];
    const noData = [];

    for (let index = 0; index < audienceDetails.length; index++) {
        const users = audienceDetails[index];
        for (const user in users) {
            for (const key in users[user]) {
                const _currUser = users[user][key];
                const currUser = stringToBoolean(_currUser);
                if (await isRejectedUser(currUser)) {
                    rejected.push(currUser);
                } else if (isWaitingForApproval(currUser)) {
                    needAprroval.push(currUser);
                } else if (noDataForThisUser(currUser)) {
                    noData.push(currUser);
                } else {
                    approved.push(currUser);
                }
            }
        }
    }

    return { approved, needAprroval, rejected, noData };

}

export async function isRejectedUser(user) {
    return unSubscribed(user) || isB2B(user) || isChannels(user) || await contactedLately(user);
}

function isWaitingForApproval(user) {
    return isManaged(user);
}

function noDataForThisUser(user) {
    return isNotExistUser(user)
}

const unSubscribed = (user) => user?.unqualified_for_emails_ind === true;
const isChannels = (user) => user?.channels_ind === true;
const isB2B = (user) => user?.b2b_ind === true;
const isManaged = (user) => user?.managed_ind === true;

const contactedLately = async (user) => user?.contacted_lately_ind === true || await getIsContactedUser(user.uuid);
const isNotExistUser = (user) => user?.data && user.data.includes('No data for uuid');




function stringToBoolean(obj) {
    const toReturn = { ...obj };
    for (const property in toReturn) {
        if (toReturn[property] === 'true')
            toReturn[property] = true;
        if (toReturn[property] === 'false')
            toReturn[property] = false;
    }
    
    return toReturn;

}