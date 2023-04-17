import wixWindow from 'wix-window';
import { state } from 'public/Pages/Communication/state-management.js';
import * as AudienceHandler from 'backend/target-audience-handler-wrapper.jsw';
import * as DataHandler from 'backend/data-methods-wrapper.jsw';
import { getTokenset } from './login.js';
import { local } from 'wix-storage';
import { targetAudienceState } from 'public/Pages/Communication/Target-Audience/target-audience.js';

import pLimit from 'p-limit';

export async function getAudienceDetails(uuidsAndMsidsList) {

    const limit = pLimit(10);

    const isValid = validateFile(uuidsAndMsidsList)
    if (isValid) {
        const tokenset = await getTokenset();
        const userJWT = tokenset.access_token;
        if ($w('#rejectedRepeater').hidden)
            $w('#rejectedRepeater, #needApprovalReapter, #approvedRepeater').show();

        const chunkSize = 50;
        const chunks = [];

        for (let i = 0; i < uuidsAndMsidsList.length; i += chunkSize) {
            chunks.push(uuidsAndMsidsList.slice(i, i + chunkSize));
        }

        let promises = chunks.map(chunk => {
            return limit(() => AudienceHandler.getAudienceDetails(chunk, userJWT));
        });

        const results = await Promise.all(promises);
        const toReturn = { approved: [], rejected: [], needAprroval: [] };
        for (let index = 0; index < results.length; index++) {
            const res = results[index];
            toReturn.approved.push(...res.approved);
            toReturn.rejected.push(...res.rejected);
            toReturn.needAprroval.push(...res.needAprroval);
        }

        return toReturn;

    } else {

        if ($w('#rejectedRepeater').isVisible)
            setNotValidFileUI();
        wixWindow.openLightbox('CSV File Error', { "communication": state.communication });
        return;
    }
}

export async function getSentCommunicationDetails() {
    const tokenset = await getTokenset();
    const userJWT = tokenset.access_token;
    const userID = JSON.parse(local.getItem('userInfo')).uuid;
    return await DataHandler.getSentCommunicationDetails(userID, userJWT);
}

function validateFile(uuidsAndMsids) {
    let isValid = true;
    if (!Array.isArray(uuidsAndMsids)) {
        isValid = false;
    }
    uuidsAndMsids.forEach((item) => {
        const keys = Object.keys(item);
        if (keys.length > 2) {
            isValid = false;
        }
        if (!keys.includes('uuid')) {
            isValid = false;
        }
        if (keys.includes('MSID')) {
            isValid = false;
        }
    })
    return isValid
}

const setNotValidFileUI = () => {
    targetAudienceState.setTotalCounter(0);
    targetAudienceState.setApprovalCounter(0)
    targetAudienceState.setNeedApprovalCounter(0);
    targetAudienceState.setRejectedCounter(0)
    targetAudienceState.setNeedApprovalCounter(0);
    $w('#rejectedRepeater, #needApprovalReapter, #approvedRepeater').hide();
}

const mockData = {
    "data": [{
            "sent_date": "2020-12-08 07:48:27.000",
            "subjectLine": "It's Tom from Wix — I'd love to get your feedback",
            "delivered": "6",
            "opened": "0",
            "_id": "02484B9C-17D2-4848-8810-E0CD6DE23671"
        },
        {
            "sent_date": "2020-12-08 07:48:22.000",
            "delivered": "8",
            "subjectLine": "this is a try of mock data 2",
            "opened": "3",
            "_id": "02484B9C-17D2-4848-8810-E0CD6DE23671"
        },
        {
            "sent_date": "2020-12-08 07:48:25.000",
            "delivered": "11",
            "subjectLine": "this is a try of mock data 1",
            "opened": "1",
            "_id": "02484B9C-17D2-4848-8810-E0CD6DE23671"
        },
    ]
}