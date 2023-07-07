import { ok, sendStatus, redirect } from "wix-router";
import { getCommunication } from './data-methods.js';
import { countAllUserCommunications } from 'backend/data-methods-wrapper.jsw';

export async function setCommunication(routerRequest) {
    try {
        const communicationID = routerRequest.path[0] || routerRequest.query?.communicationId;
        let communication;
        if (communicationID) {
            communication = await getCommunication(communicationID);
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
        const [all, draft, archive, sent, templates] = await countAllUserCommunications();
        return ok("my-communications-page", { all, draft, archive, sent, templates });
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