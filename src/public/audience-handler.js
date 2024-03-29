// @ts-ignore
import wixWindow from 'wix-window';

// @ts-ignore
import * as AudienceHandler from 'backend/target-audience-handler-wrapper.jsw';
// @ts-ignore
import * as DataHandler from 'backend/data-methods-wrapper.jsw';
// @ts-ignore
import * as MarketingAPI from 'backend/marketing-api-wrapper.jsw';

import { state } from './Pages/Communication/state-management.js';
import * as constants from './consts.js';
import { targetAudienceState } from './Pages/Communication/Target-Audience/target-audience.js';

import * as Utils from './_utils.js';

import pLimit from 'p-limit';

export async function getAudienceDetails(payload) {
    const limit = pLimit(10);

    const validateRes = validateFile(payload);
    if (validateRes.valid) {
        const uuidsAndMsidsList = validateRes.uuidsAndMsidsList;

        const userJWT = await Utils.getUserJWTToken();
        if (!userJWT) {
            console.warn('public -> audiance-handler.js userJWT is missing');
        }
        const chunkSize = 1000;
        const chunks = [];

        for (let i = 0; i < uuidsAndMsidsList.length; i += chunkSize) {
            chunks.push(uuidsAndMsidsList.slice(i, i + chunkSize));
        }
        let promises = chunks.map(chunk => limit(() => AudienceHandler.getAudienceDetails(chunk, userJWT)));

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
        wixWindow.openLightbox(constants.Lightboxs.CSVFileError, { "communication": state.communication, reason: validateRes.reason });
    }
}

export async function getSentCommunications() {
    const filters = { "sent": true };
    const [userJWT, getAllUserCommunicationsRes] = await Promise.all([Utils.getUserJWTToken(), DataHandler.getAllUserCommunications(filters)]);
    const uniqueIds = [...new Set(getAllUserCommunicationsRes.items.map((item) => item._id))];
    let results = {};
    if (uniqueIds.length > 0)
        results = await MarketingAPI.getSentCommunications(uniqueIds, userJWT);
    return results;
}

function validateFile(payload) {

    if (!Utils.isArray(payload)) {
        return { valid: false, reason: constants.csvErrors.notValidFile };
    }

    if (payload.length > constants.csvFileLimit) {
        return { valid: false, reason: constants.csvErrors.moreThenLimitItems };
    }

    const uuidsAndMsidsList = clearAudiance(payload);

    if (uuidsAndMsidsList.length > 0) {
        return { valid: true, uuidsAndMsidsList };
    }

    return { valid: false, reason: constants.csvErrors.missingUUIDMSID };
}

export function clearAudiance(payload) {
    const uuidsAndMsidsList = [];
    for (let index = 0; index < payload.length; index++) {
        const item = Utils.lowerize(payload[index]);
        if (item.uuid) {
            if (Utils.isUUID(item.uuid)) {
                const toPush = { uuid: item.uuid };
                if (item.msid)
                    toPush.msid = item.msid
                uuidsAndMsidsList.push(toPush);
            }
        }
    }
    console.log('clearAudiance', { uuidsAndMsidsList });
    return uuidsAndMsidsList;
}

const setNotValidFileUI = () => {
    targetAudienceState.setTotalCounter(0);
    targetAudienceState.setApprovalCounter(0)
    targetAudienceState.setNeedApprovalCounter(0);
    targetAudienceState.setRejectedCounter(0)
    targetAudienceState.setNeedApprovalCounter(0);
    $w('#rejectedRepeater').data = [];
    $w('#needApprovalReapter').data = [];
    $w('#approvedRepeater').data = [];
}
