import wixWindow from 'wix-window';

import { sendBi } from 'public/BI/biModule.js';
import { isValidFileBeforeUpload } from 'public/Pages/Communication/Target-Audience/csv-file-handler.js';
import { csvErrors } from 'public/consts.js';

import * as constants from 'public/consts';

$w.onReady(function () {
    const communication = (wixWindow.lightbox.getContext()).communication;
    $w("#uploadCSVButton").fileType = "Document";
    $w('#uploadCSVButton').onChange(async (event) => {
        try {
            $w('#uploadCSVButton').disable();
            if (isValidFileBeforeUpload(event)) {
                const recivedData = await $w("#uploadCSVButton").uploadFiles();
                sendBi('replaceCSV', { 'campaignId': communication._id, 'buttonName': 'replace_CSV_file' });
                wixWindow.lightbox.close({ uploadedFiles: recivedData });
            } else {
                wixWindow.openLightbox(constants.Lightboxs.CSVFileError, { communication, reason: csvErrors.notValidFile });
            }
        } catch (error) {
            let reason = csvErrors.uploadFail;
            if (error.errorCode == -7750) {
                reason = csvErrors.fileIsEmpty;
            } else {
                console.error('Target Audiance - Replace CSV Warning Po -> uploadFiles failed - origin error - ' + error);
            }
            await wixWindow.openLightbox(constants.Lightboxs.CSVFileError, { communication, reason });
            $w('#uploadCSVButton').enable();
        }
    })

    $w('#cancelBtn').onClick(async (event) => {
        sendBi('replaceCSV', { 'campaignId': communication._id, 'buttonName': 'cancel' })
    })
});