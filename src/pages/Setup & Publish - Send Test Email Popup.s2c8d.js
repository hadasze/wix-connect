import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';
import { sendTestEmail } from 'public/user-mailer';

import * as Fedops from 'public/wix-fedops-api.js';


$w.onReady(function () {
    const state = wixWindow.lightbox.getContext();

    const communication = state.communication;
    $w('#sendBtn').onClick((event) => {
        $w('#cancelBtn').disable();
        if ($w('#testEmailsInput').valid) {
            $w('#emailIsNotValidToast').hide();
            const email = $w('#testEmailsInput').value;
            sendBi('testEmail', { 'campaignId': communication._id, 'button_name': 'send' });
            Fedops.interactionStarted(Fedops.events.sendTestEmail);
            sendTestEmail(state, email);
        } else {
            $w('#emailIsNotValidToast').show();
        }
    })
    $w('#cancelBtn').onClick((event) => {
        sendBi('testEmail', { 'campaignId': communication._id, 'button_name': 'cancel' })
    })

    $w('#testEmailsInput').onInput((event) => {
        $w('#testEmailsInput').value.length > 0 ? $w('#sendBtn').enable() : $w('#sendBtn').disable();
    });
});