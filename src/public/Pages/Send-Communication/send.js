// @ts-ignore
import wixWindow from 'wix-window';

import { sendBi } from '../../BI/biModule.js';
import { sendEmails } from '../../user-mailer';
import { SendCommunication as Comp } from '../../components.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as Constants from '../../consts.js';

export function setEvents() {
    const { state, approvedCounter } = wixWindow.lightbox.getContext();
    console.log({ state, approvedCounter });
    Comp.sendCommunicationTitleText.text = Constants.Text.SEND_POPUP_TITLE(approvedCounter);

    if (+approvedCounter == 0) {
        Comp.sendBtn.disable();
    } else {
        Comp.sendBtn.enable();
    }

    Comp.sendBtn.onClick(async (event) => {
        Comp.cancelBtn.disable();
        Comp.sendBtn.disable();
        sendBi('sendCommunication', { 'campaignId': state.communication._id, 'button_name': 'send' });
        Fedops.interactionStarted(Fedops.events.sendEmail);
        await sendEmails(state);
    })

    Comp.cancelBtn.onClick((event) => {
        sendBi('sendCommunication', { 'campaignId': state.communication._id, 'button_name': 'cancel' });
        wixWindow.lightbox.close({ buttonName: Constants.Text.CANCEL });
    })
}