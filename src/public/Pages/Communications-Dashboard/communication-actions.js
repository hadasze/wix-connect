import wixLocation from 'wix-location';
import { updateCommunication, saveCommunication } from 'backend/data-methods-wrapper.jsw';
import { Urls } from 'public/consts.js';
import { sendBi } from '../../BI/biModule.js';

export const setCommunicationMoreActionsEvents = ($item, itemData) => {
    $item('#editCommunicationButton').onClick((event) => {
        sendBi('campainOptions', { 'campaignId': itemData._id, 'button_name': 'edit' })
        wixLocation.to(Urls.EXISTS_COMMUNICATION + itemData._id)
    })
    $item('#reuseCommunicationButton').onClick(async (event) => {
        reuseCommunication(itemData)
    })

    $item('#saveAsTempalteButton').onClick(async (event) => {
        $item('#saveAsTempalteButton').disable();
        const template = resetCommunication(itemData)
        template.isTemplate = true;
        try {
            await saveCommunication(template);
            sendBi('campainOptions', { 'campaignId': itemData._id, 'button_name': 'reusave_as_templatese' });
            wixLocation.to(wixLocation.url);
            $item('#saveAsTempalteButton').enable();
        } catch (err) {
            console.error('public/communications-dashboard save as template communication ', err);
            $item('#saveAsTempalteButton').enable();
        }
    })

    // Binyaminm CR: added debounce in case the user want to archive more then one at a time
    let archiveCommunicationButtonDebounceTimer;
    $item('#archiveCommunicationButton').onClick(async (event) => {
        itemData.archive = true;
        try {
            await updateCommunication(itemData);
            sendBi('campainOptions', { 'campaignId': itemData._id, 'button_name': 'archive' });
            if (archiveCommunicationButtonDebounceTimer) {
                clearTimeout(archiveCommunicationButtonDebounceTimer);
                archiveCommunicationButtonDebounceTimer = undefined;
            }

            archiveCommunicationButtonDebounceTimer = setTimeout(() => {
                wixLocation.to(wixLocation.url);
            }, 3000)
        } catch (err) {
            console.error('public/communications-dashboard archive communication ', err);
        }
    })

    let uarchiveCommunicationButtonDebounceTimer;
    $item('#uarchiveCommunicationButton').onClick(async (event) => {
        itemData.archive = false;
        try {
            await updateCommunication(itemData);
            sendBi('campainOptions', { 'campaignId': itemData._id, 'button_name': 'unarchive' })
            if (uarchiveCommunicationButtonDebounceTimer) {
                clearTimeout(uarchiveCommunicationButtonDebounceTimer);
                uarchiveCommunicationButtonDebounceTimer = undefined;
            }

            uarchiveCommunicationButtonDebounceTimer = setTimeout(() => {
                wixLocation.to(wixLocation.url);
            }, 3000)
        } catch (err) {
            console.error('public/communications-dashboard unarchive communication ', err);
        }
    })
}

export const reuseCommunication = async (communication) => {
    const reused = resetCommunication(communication);
    reused.draft = true;
    try {
        const saved = await saveCommunication(reused);
        sendBi('campainOptions', { 'campaignId': communication._id, 'button_name': 'reuse' })
        wixLocation.to(Urls.EXISTS_COMMUNICATION + saved._id)
    } catch (err) {
        console.error('public/communications-dashboard reuse communication ', err);
    }
}

const resetCommunication = (communication) => {
    delete communication._id;
    communication.sent = false;
    communication.draft = false;
    communication.archive = false;
    communication.isTemplate = false;
    communication.targetAudienceCsv = null;
    communication.targetAudience = null;
    communication.manuallyApprovedUsers = [];
    return communication;
}