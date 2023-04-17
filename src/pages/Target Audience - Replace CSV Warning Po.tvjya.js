import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    const communication = (wixWindow.lightbox.getContext()).communication;
    $w("#uploadCSVButton").fileType = "Document";
    $w('#uploadCSVButton').onChange(async (event) => {
        const recivedData = await $w("#uploadCSVButton").uploadFiles();
        sendBi('replaceCSV', { 'campaignId': communication._id, 'button_name': 'replace_CSV_file' })
        wixWindow.lightbox.close({ uploadedFiles: recivedData });
    })
    $w('#cancelBtn').onClick(async (event) => {
        sendBi('replaceCSV', { 'campaignId': communication._id, 'button_name': 'cancel' })
    })
});