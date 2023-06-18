import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { state } from 'public/Pages/Communication/state-management.js';
import { toJS } from 'mobx';
import { getDownloadFileUrlFromArray } from 'backend/target-audience-handler-wrapper.jsw';
import { getAudienceDetails } from 'public/audience-handler.js';
import { clearAllRepeatersAudienceData } from './uuids-repeater-handler.js'
import { getTargetAudience } from 'backend/data-methods-wrapper.jsw';
import { AllAudienceRepeaterButtons } from 'public/consts.js';
import { sendBi } from '../../../BI/biModule.js';
import { create } from 'wix-fedops';
const fedopsLogger = create('wix-connect');

export const initCSVFileActions = () => {
    setUploadCSVEvent();
    replaceCsvFileEvent();
    downloadReportEvent();
    loadUploadFileScreen();
}

const loadUploadFileScreen = () => {
    if ($w('#TargetAudienceContent').currentState.id === 'TargetAudienceContentUpload')
        $w('#csvDetailsAndActionsBox').hide();
}

const replaceCsvFileEvent = async () => {
    $w('#replaceCsvFile').onClick(async (event) => {
        fedopsLogger.interactionStarted('replace-csv');
        try {
            const recivedData = await wixWindow.openLightbox('Target Audience - Replace CSV Warning Po', { "communication": state.communication });
            if (!recivedData?.uploadedFiles) {
                return
            }

            const uploadedFile = recivedData.uploadedFiles[0];
            const csvLocalUrl = uploadedFile.fileUrl;
            cleanOldFile();
            clearAllRepeatersAudienceData();
            state.resetApprovedUserList();
            state.setTargetAudienceCSV(csvLocalUrl);
            prepareUIAfterReplacingFile(uploadedFile.originalFileName);
            sendBi('audienceClick', { 'campaignId': state.communication._id, 'button_name': 'replace_csv_file' })
            await customePolling();
            fedopsLogger.interactionEnded('replace-csv');
        } catch (error) {
            console.error('public/Pages/Communication/Target-Audience/csv-file-handler.js -> replaceCsvFileEvent failed - origin error -' + error);
            $w('#replaceCsvFile').enable();
        }
    })

    $w('#replaceCsvFile').onMouseIn((event) => {
        $w("#replaceCSVTooltipBox").show();
    })

    $w('#replaceCsvFile').onMouseOut((event) => {
        $w("#replaceCSVTooltipBox").hide();
    })

}

const prepareUIAfterReplacingFile = (fileName) => {
    $w('#TargetAudienceContent').changeState('TargetAudienceContentLoading') && $w('#csvDetailsAndActionsBox').hide();
    AllAudienceRepeaterButtons.forEach((button) => {
        $w(`#${button}`).enable();
    })
    state.setTargetAudienceCSVFileName(fileName)
}

const setUploadCSVEvent = () => {
    fedopsLogger.interactionStarted('upload-csv');
    $w("#uploadCSVButton").fileType = "Document";
    $w('#uploadCSVButton').onChange(async (event) => {
        try {
            setTimeout(() => {
                $w('#TargetAudienceContent').changeState('TargetAudienceContentLoading');
            }, 100);
            cleanOldFile();
            $w("#uploadCSVButton").disable();
            const uploadedFile = await uploadFileAndSetAudience();
            state.setTargetAudienceCSVFileName(uploadedFile.originalFileName)
            sendBi('uploadCSV', { 'campaignId': state.communication._id, 'button_name': 'upload_csv_file' })
            await customePolling();
            fedopsLogger.interactionEnded('upload-csv');
        } catch (error) {
            $w('#TargetAudienceContent').changeState('TargetAudienceContentUpload') && $w('#csvDetailsAndActionsBox').hide();
            console.error();
        }
        $w("#uploadCSVButton").enable();
    })
}

const customePolling = async (cycle) => {
    if (!cycle)
        cycle = 0;
    try {
        if (cycle > 20) {
            throw new Error('Csv upload failed');
        }
        let audience;
        setTimeout(async () => {
            audience = await getTargetAudience(state.communication._id);
            if (audience) {
                state.setTargetAudience(audience);
                return;
            } else {
                return await customePolling(cycle + 1);
            }
        }, 10000);

    } catch (error) {
        return Promise.reject('public -> csv-file-handler.js -> customePolling failed -origin error- ' + error);
    }
}

const downloadReportEvent = () => {
    $w('#downloadReportButton').onClick(async (event) => {
        try {
            $w('#downloadReportButton').disable();
            const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)));
            const audienceData = await getAudienceDetails(uuidsAndMsidsList);
            const dataForFile = [...audienceData.approved, ...audienceData.needAprroval, ...audienceData.rejected];
            const url = await getDownloadFileUrlFromArray(dataForFile, "targetAudienceReport")
            wixLocation.to(url);
            sendBi('audienceClick', { 'campaignId': state.communication._id, 'button_name': 'download_report' })
            showToast('csvFileDownloadedBanner', 2000);
            $w('#downloadReportButton').enable();
        } catch (err) {
            console.error("downloadReportEvent error, original error: ", err);
        }
    })

    $w('#downloadReportButton').onMouseIn((event) => {
        $w("#downloadCSVTooltipBox").show();
    })

    $w('#downloadReportButton').onMouseOut((event) => {
        $w("#downloadCSVTooltipBox").hide();
    })

}

const cleanOldFile = () => {
    state.setTargetAudienceCSV(undefined);
    state.setTargetAudience(undefined);
}

export const showToast = (toastName, period) => {
    $w(`#${toastName}`).show();
    setTimeout(() => { $w(`#${toastName}`).hide() }, period);
}

const uploadFileAndSetAudience = async () => {
    const uploadedFiles = await $w("#uploadCSVButton").uploadFiles();
    const csvLocalUrl = uploadedFiles[0].fileUrl;
    state.setTargetAudienceCSV(csvLocalUrl);
    return uploadedFiles[0];
}