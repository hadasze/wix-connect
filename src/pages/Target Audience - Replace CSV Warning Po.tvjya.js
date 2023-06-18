import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    const communication = (wixWindow.lightbox.getContext()).communication;
    $w("#uploadCSVButton").fileType = "Document";
    $w('#uploadCSVButton').onChange(async (event) => {
        try {
            $w('#uploadCSVButton').disable();
            const recivedData = await $w("#uploadCSVButton").uploadFiles();
            sendBi('replaceCSV', { 'campaignId': communication._id, 'button_name': 'replace_CSV_file' })
            wixWindow.lightbox.close({ uploadedFiles: recivedData });
        } catch (error) {
            console.error('Target Audiance - Replace CSV Warning Po -> uploadFiles failed - origin error - ' + error);
            $w('#uploadCSVButton').enable();
        }
    })

    $w('#cancelBtn').onClick(async (event) => {
        sendBi('replaceCSV', { 'campaignId': communication._id, 'button_name': 'cancel' })
    })
});