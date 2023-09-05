// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import wixLocation from 'wix-location';

import { toJS } from 'mobx';

import { state } from '../state-management.js';
import { getAudienceDetails } from '../../../audience-handler.js';
import { sendBi } from '../../../BI/biModule.js';
import { CommunicationPage as Comp, WC } from '../../../components.js';

import * as Fedops from '../../../wix-fedops-api.js';
import * as constants from '../../../consts.js';

// @ts-ignore
import { getDownloadFileUrlFromArray } from 'backend/target-audience-handler-wrapper.jsw';
// @ts-ignore
import { getTargetAudience } from 'backend/data-methods-wrapper.jsw';

export const initCSVFileActions = () => {
    setUploadCSVEvent();
    replaceCsvFileEvent();
    downloadReportEvent();
    loadUploadFileScreen();
}

export const showToast = (toastName, period) => {
    WC(toastName).show();
    setTimeout(() => { WC(toastName).hide() }, period);
}

export const isValidFileBeforeUpload = (event) => event.target.value[0].valid && event.target.value[0].name.toLowerCase().includes('csv');

const loadUploadFileScreen = () => {
    if (Comp.targetAudienceContent.currentState.id === Comp.States.TargetAudienceContentUpload)
        Comp.csvDetailsAndActionsBox.hide();
}

const replaceCsvFileEvent = async () => {
    Comp.replaceCsvFile.onClick(async (event) => {
        Fedops.interactionStarted(Fedops.events.replaceCSV);
        try {
            const recivedData = await wixWindow.openLightbox(constants.Lightboxs.replaceCSV, { "communication": state.communication });
            if (!recivedData?.uploadedFiles) {
                return
            }

            const uploadedFile = recivedData.uploadedFiles[0];
            const csvLocalUrl = uploadedFile.fileUrl;
            cleanOldFile();
            state.resetApprovedUserList();
            state.setTargetAudienceCSV(csvLocalUrl);
            prepareUIAfterReplacingFile(uploadedFile.originalFileName);
            sendBi('audienceClick', { 'campaignId': state.communication._id, 'buttonName': 'replace_csv_file' })
            await customePolling();
            Fedops.interactionEnded(Fedops.events.replaceCSV);

        } catch (error) {
            console.error('public/Pages/Communication/Target-Audience/csv-file-handler.js -> replaceCsvFileEvent failed - origin error - ' + error);
            Comp.replaceCsvFile.enable();
        }
    })

    Comp.replaceCsvFile.onMouseIn((event) => {
        Comp.replaceCSVTooltipBox.show();
    })

    Comp.replaceCsvFile.onMouseOut((event) => {
        Comp.replaceCSVTooltipBox.hide();
    })

}

const prepareUIAfterReplacingFile = (fileName) => {
    Comp.targetAudienceContent.changeState(Comp.States.TargetAudienceContentLoading) && Comp.csvDetailsAndActionsBox.hide();
    constants.AllAudienceRepeaterButtons.forEach((button) => {
        WC(button).enable();
    })
    state.setTargetAudienceCSVFileName(fileName)
}

const setUploadCSVEvent = () => {
    Comp.uploadCSVButton.fileType = "Document";
    Comp.uploadCSVButton.onChange(async (event) => {
        try {
            if (isValidFileBeforeUpload(event)) {
                setTimeout(() => {
                    Comp.targetAudienceContent.changeState(Comp.States.TargetAudienceContentLoading);
                }, 100);
                cleanOldFile();
                Comp.uploadCSVButton.disable();

                const uploadedFile = await uploadFileAndSetAudience();

                state.setTargetAudienceCSVFileName(uploadedFile.originalFileName);
                sendBi('uploadCSV', { 'campaignId': state.communication._id, 'buttonName': 'upload_csv_file' });
                await customePolling();


            } else {
                wixWindow.openLightbox(constants.Lightboxs.CSVFileError, { communication: state.communication, reason: constants.csvErrors.notValidFile });
            }
        } catch (error) {
            Comp.targetAudienceContent.changeState(Comp.States.TargetAudienceContentUpload) && Comp.csvDetailsAndActionsBox.hide();
            console.error('public -> pages->Communication ->Target-Audiance ->csv-file-handler.js -> uploadCSVButton onChange failed - origin error - ', error);
        }
        Comp.uploadCSVButton.enable();
    })
}

const customePolling = async (cycle) => {
    if (!cycle)
        cycle = 1;
    try {
        if (cycle >= 10) {
            throw new Error('Can not extract audiance from CSV');
        }
        let audience;
        setTimeout(async () => {
            audience = await getTargetAudience(state.communication._id);

            if (audience) {
                state.setTargetAudience(audience);
                sendCSVUploadedBIEvent();
                return;
            } else {
                return await customePolling(cycle + 1);
            }
        }, 5000);

    } catch (error) {
        await Comp.targetAudienceContent.changeState(Comp.States.TargetAudienceContentUpload) && Comp.csvDetailsAndActionsBox.hide();
        await wixWindow.openLightbox(constants.Lightboxs.CSVFileError, { communication: state.communication, reason: constants.csvErrors.missingUUIDMSID });
        throw new Error('public -> csv-file-handler.js -> customePolling failed -origin error- ' + error);
    }
}

async function sendCSVUploadedBIEvent() {
    const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)));
    const audienceData = await getAudienceDetails(uuidsAndMsidsList);
    if (audienceData) {
        sendBi('CSVUploaded', { campaignId: state.communication._id, approved: audienceData.approved.length, needApproval: audienceData.needAprroval.length, rejected: audienceData.rejected.length });
    }
}

const downloadReportEvent = () => {
    Comp.downloadReportButton.onClick(async (event) => {
        try {
            Comp.downloadReportButton.disable();
            const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)));
            const audienceData = await getAudienceDetails(uuidsAndMsidsList);
            if (audienceData) {
                const dataForFile = [...audienceData.approved, ...audienceData.needAprroval, ...audienceData.rejected];
                const url = await getDownloadFileUrlFromArray(dataForFile, "targetAudienceReport")
                wixLocation.to(url);
                sendBi('audienceClick', { 'campaignId': state.communication._id, 'buttonName': 'download_report' })
                showToast('csvFileDownloadedBanner', 2000);
                Comp.downloadReportButton.enable();
            }
        } catch (err) {
            console.error("downloadReportEvent error, original error: ", err);
        }
    })

    Comp.downloadReportButton.onMouseIn((event) => {
        Comp.downloadCSVTooltipBox.show();
    })

    Comp.downloadReportButton.onMouseOut((event) => {
        Comp.downloadCSVTooltipBox.hide();
    })

}

const cleanOldFile = () => {
    state.setTargetAudienceCSV(undefined);
    state.setTargetAudience(undefined);
}

const uploadFileAndSetAudience = async () => {
    Fedops.interactionStarted(Fedops.events.uploadCSV);
    const uploadedFiles = await Comp.uploadCSVButton.uploadFiles();
    Fedops.interactionEnded(Fedops.events.uploadCSV);
    const csvLocalUrl = uploadedFiles[0].fileUrl;
    state.setTargetAudienceCSV(csvLocalUrl);
    return uploadedFiles[0];
}

