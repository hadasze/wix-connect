import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';
import { Text } from 'public/consts.js';

$w.onReady(function () {
    const { communication, approvedCounter } = (wixWindow.lightbox.getContext());
    $w('#sendCommunicationTitleText').text = Text.SEND_POPUP_TITLE(approvedCounter);

    if (+approvedCounter == 0) {
        $w('#sendBtn').disable()
    } else {
        $w('#sendBtn').enable();
    }

    $w('#sendBtn').onClick((event) => {
        $w('#sendBtn').disable();
        sendBi('sendCommunication', { 'campaignId': communication._id, 'button_name': 'send' });
        wixWindow.lightbox.close({ buttonName: Text.SEND });
    })
    $w('#cancelBtn').onClick((event) => {
        sendBi('sendCommunication', { 'campaignId': communication._id, 'button_name': 'cancel' });
        wixWindow.lightbox.close({ buttonName: Text.CANCEL });
    })
});