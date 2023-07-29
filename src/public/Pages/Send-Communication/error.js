import { SendCommunication as Comp } from '../../components.js';
import { redirectToMyCommunications } from '../../_utils.js';

export function setEvents() {
    Comp.gotItButton.onClick((event) => {
        Comp.gotItButton.disable();
        redirectToMyCommunications();
    })
}