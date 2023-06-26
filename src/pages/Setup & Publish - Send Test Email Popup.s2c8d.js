import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    const communication = (wixWindow.lightbox.getContext()).communication;
    $w('#sendBtn').onClick((event) => {
        if ($w('#testEmailsInput').valid) {
            $w('#emailIsNotValidToast').hide();
            const email = $w('#testEmailsInput').value;
            sendBi('testEmail', { 'campaignId': communication._id, 'button_name': 'send' })
            wixWindow.lightbox.close({ email });
        } else {
            $w('#emailIsNotValidToast').show();
        }
    })
    $w('#cancelBtn').onClick((event) => {
        sendBi('testEmail', { 'campaignId': communication._id, 'button_name': 'cancel' })
    })

    $w('#testEmailsInput').onChange((event) => {
        $w('#testEmailsInput').value.length > 0 ? $w('#sendBtn').enable() : $w('#sendBtn').disable();
    })
});