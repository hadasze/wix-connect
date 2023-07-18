import { ok, sendStatus, redirect } from "wix-router";
import { getCommunication, getAllUserCommunications } from './data-methods.js';
import { countAllUserCommunications } from './data-methods.js';
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
//todo: make it faster
export async function setMyCommunications(routerRequest) {
    try {
        let communicationDetails = {};
        if (routerRequest.query?.token) {
            const filters = { "sent": true };
            const getAllUserCommunicationsRes = await getAllUserCommunications(filters);
            const uniqueIds = [...new Set(getAllUserCommunicationsRes.items.map((item) => item._id))];
            if (uniqueIds.length > 0)
                communicationDetails = await MarketingAPI.getSentCommunications(uniqueIds, routerRequest.query?.token);
        }

        const [all, draft, archive, sent, templates] = await countAllUserCommunications();
        return ok("my-communications-page", { count: { all, draft, archive, sent, templates }, communicationDetails });
    } catch (error) {
        return sendStatus('500', 'backend -> comunication-router-handler -> setCommunication failed - origen error - ' + error.message);
    }
}

export async function setPreview(routerRequest) {
    const communicationID = routerRequest.path[0]
    try {
        const communication = await getCommunication(communicationID);
        return ok("preview-page", communication);
    } catch (err) {
        return sendStatus('500', 'backend -> comunication-router-handler -> setPreview failed - origen error - ' + err.message);
    }
}