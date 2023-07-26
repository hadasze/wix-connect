import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';
import { Text } from 'public/consts.js';

import * as Fedops from 'public/wix-fedops-api.js';

import { sendEmails } from 'public/user-mailer';


$w.onReady(function () {
    const { state, approvedCounter } = wixWindow.lightbox.getContext();
    console.log({ state, approvedCounter });
    $w('#sendCommunicationTitleText').text = Text.SEND_POPUP_TITLE(approvedCounter);

    if (+approvedCounter == 0) {
        $w('#sendBtn').disable()
    } else {
        $w('#sendBtn').enable();
    }

    $w('#sendBtn').onClick(async (event) => {
        $w('#cancelBtn').disable();
        $w('#sendBtn').disable();
        sendBi('sendCommunication', { 'campaignId': state.communication._id, 'button_name': 'send' });
        Fedops.interactionStarted(Fedops.events.sendEmail);
        await sendEmails(state);
    })

    $w('#cancelBtn').onClick((event) => {
        sendBi('sendCommunication', { 'campaignId': state.communication._id, 'button_name': 'cancel' });
        wixWindow.lightbox.close({ buttonName: Text.CANCEL });
    })
});