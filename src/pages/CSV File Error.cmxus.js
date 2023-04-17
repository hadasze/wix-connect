import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    const communication = (wixWindow.lightbox.getContext()).communication;

    $w('#gotItBtn').onClick((event) => {
        sendBi('uploadCSVfailure', { 'campaignId': communication._id, 'button_name': 'got_it' })
    })
});