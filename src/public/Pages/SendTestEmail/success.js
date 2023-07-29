// @ts-ignore
import wixWindow from 'wix-window';

import { SendTestEmail as Comp } from '../../components.js';

export function setEvents() {
    Comp.gotItButton.onClick((event) => {
        wixWindow.lightbox.close();
    })
}