import wixWindow from 'wix-window';
import { local } from 'wix-storage';

import * as AudienceHandler from 'backend/target-audience-handler-wrapper.jsw';
import * as DataHandler from 'backend/data-methods-wrapper.jsw';

import { state } from './Pages/Communication/state-management.js';
import { getTokenset } from './login.js';
import { targetAudienceState } from './Pages/Communication/Target-Audience/target-audience.js';
import { csvErrors } from './consts.js';

import * as Utils from './_utils.js';

import pLimit from 'p-limit';

export async function getAudienceDetails(payload) {

    const limit = pLimit(10);

    const validateRes = validateFile(payload);

    if (validateRes.valid) {
        const uuidsAndMsidsList = validateRes.uuidsAndMsidsList;
        const tokenset = await getTokenset();
        const userJWT = tokenset.access_token;
        if ($w('#rejectedRepeater').hidden)
            $w('#rejectedRepeater, #needApprovalReapter, #approvedRepeater').show();

        const chunkSize = 1000;
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
        wixWindow.openLightbox('CSV File Error', { "communication": state.communication, reason: validateRes.reason });
        return;
    }
}

export async function getSentCommunicationDetails() {
    const tokenset = await getTokenset();
    const userJWT = tokenset.access_token;
    const userID = JSON.parse(local.getItem('userInfo')).uuid;
    return await DataHandler.getSentCommunicationDetails(userID, userJWT);
}

function validateFile(payload) {

    const uuidsAndMsidsList = [];

    if (!Utils.isArray(payload)) {
        return { valid: false, reason: csvErrors.notValidFile };
    }

    for (let index = 0; index < payload.length; index++) {
        const item = Utils.lowerize(payload[index]);
        if (item.uuid && item.msid) {
            if (Utils.isUUID(item.uuid) && Utils.isUUID(item.msid))
                uuidsAndMsidsList.push({ uuid: item.uuid, msid: item.msid });
        }
    }

    if (uuidsAndMsidsList.length > 0) {
        return { valid: true, uuidsAndMsidsList };
    }

    return { valid: false, reason: csvErrors.missingUUIDMSID };
}

const setNotValidFileUI = () => {
    targetAudienceState.setTotalCounter(0);
    targetAudienceState.setApprovalCounter(0)
    targetAudienceState.setNeedApprovalCounter(0);
    targetAudienceState.setRejectedCounter(0)
    targetAudienceState.setNeedApprovalCounter(0);
    $w('#rejectedRepeater, #needApprovalReapter, #approvedRepeater').hide();
}
