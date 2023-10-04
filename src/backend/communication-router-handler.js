import { ok, sendStatus, redirect } from "wix-router";
import { getCommunication, getAllUserCommunications } from './data-methods.js';
import { getServerToken } from "./ero-api.js";

import * as MarketingAPI from './marketing-api.js';


export async function setCommunication(routerRequest) {
    try {
        const communicationID = routerRequest.path[0] || routerRequest.query?.communicationId;
        let communication;
        if (communicationID) {
            communication = await getCommunication(communicationID);
            if (communication.sent) {
                return redirect("/preview/" + communicationID, "301")
            }
        } else {
            return redirect("/", "301")
        }
        return ok("communication-page", communication);

    } catch (error) {
        return sendStatus('500', 'backend -> comunication-router-handler -> setCommunication failed - origin error - ' + error.message);
    }
}

export async function setMyCommunications(routerRequest) {

    try {
        let communicationDetails = {};
        const sentCommunicationsIds = [];
        const filters = {};
        const options = { all: true };

        const [serverTokenSet, communications] = await Promise.all([getServerToken(), getAllUserCommunications(filters, options)]);
         
        for (let index = 0; index < communications.length; index++) {
            const item = communications[index];
            if (item.sent) {
                sentCommunicationsIds.push(item._id);
            }
        }

        if (sentCommunicationsIds.length > 0) {
            communicationDetails = await MarketingAPI.getSentCommunications(sentCommunicationsIds, serverTokenSet.access_token);
        }

        return ok("my-communications-page", { communications, communicationDetails });
    } catch (error) {
        return sendStatus('500', 'backend -> comunication-router-handler -> setCommunication failed - origin error - ' + error.message);
    }
}

export async function setPreview(routerRequest) {
    const communicationID = routerRequest.path[0]
    try {
        const communication = await getCommunication(communicationID);
        return ok("preview-page", communication);
    } catch (err) {
        return sendStatus('500', 'backend -> comunication-router-handler -> setPreview failed - origin error - ' + err.message);
    }
}