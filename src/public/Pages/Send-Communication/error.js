import { SendCommunication as Comp } from '../../components.js';
import { redirectToMyCommunications } from '../../_utils.js';

export function setEvents() {
    Comp.gotItErrorButton.onClick((event) => {
        Comp.gotItErrorButton.disable();
        redirectToMyCommunications();
    })
}