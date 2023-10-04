import { SendCommunication as Comp } from '../../components.js';
import {  redirectToMyCommunications } from '../../_utils.js';

export function setEvents() {
    Comp.closeButton.onClick(async (event) => {
        Comp.closeButton.disable();
     redirectToMyCommunications();
    })
}