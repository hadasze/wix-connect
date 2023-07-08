import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';
import { csvErrors } from 'public/consts.js';

$w.onReady(function () {
    const { communication, reason } = wixWindow.lightbox.getContext();

    $w('#gotItBtn').onClick((event) => {
        sendBi('uploadCSVfailure', { 'campaignId': communication._id, 'button_name': 'got_it' })
    });

    $w('#msgText').html = csvErrors.generalMSG(reason);

});