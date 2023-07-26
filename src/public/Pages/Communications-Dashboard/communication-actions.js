import wixLocation from 'wix-location';
import { updateCommunication, saveCommunication } from 'backend/data-methods-wrapper.jsw';
import { Urls } from 'public/consts.js';
import { sendBi } from '../../BI/biModule.js';
import { removeItemFromRepeater } from '../../_utils.js';
import { state } from './communications-dashboard.js';

const $item = (event) => $w.at(event.context);
const itemData = (event, repeater) => {
    const data = repeater.data;
    return data.find(item => item._id === event.context.itemId);
}

export const setCommunicationMoreActionsEvents = () => {
    const repeater = $w('#myCommunicationsRepeater');

    $w('#communicationClickbaleArea').onClick((event) => {

        const data = itemData(event, repeater)
        if (data.archive)
            return

        if (data.sent)
            wixLocation.to(Urls.PREVIEW + event.context.itemId);

        if (data.draft)
            wixLocation.to(Urls.EXISTS_COMMUNICATION + event.context.itemId);

    });

    $w('#seeMoreActionsButton').onClick((event) => {
        $item(event)('#communicationActionsbox').expand();
    });

    $w('#myCommunicationItemBox').onMouseOut((event) => {
        $item(event)('#communicationActionsbox').collapse();
    });

    $w('#editCommunicationButton').onClick((event) => {
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'edit' });
        wixLocation.to(Urls.EXISTS_COMMUNICATION + event.context.itemId);
    });

    $w('#reuseCommunicationButton').onClick(async (event) => {
        await reuseCommunication(itemData(event, repeater));
    })

    $w('#saveAsTempalteButton').onClick(async (event) => {
        $item(event)('#saveAsTempalteButton').disable();
        const template = resetCommunication(itemData(event, repeater));
        template.isTemplate = true;
        saveCommunication(template);
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'reusave_as_templatese' });
        $item(event)('#saveAsTempalteButton').enable();
    });

    $w('#archiveCommunicationButton').onClick(async (event) => {
        $item(event)('#archiveCommunicationButton').disable();
        itemData(event, repeater).archive = true;
        updateCommunication(itemData(event, repeater));
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'archive' });
        removeItemFromRepeater(repeater, event.context.itemId);
        state.communicationsCounts.archive++;
        state.communicationsCounts.all--;
        $item(event)('#archiveCommunicationButton').enable();
    });

    $w('#uarchiveCommunicationButton').onClick(async (event) => {
        $item(event)('#uarchiveCommunicationButton').disable();
        itemData(event, repeater).archive = false;
        updateCommunication(itemData(event, repeater));
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'unarchive' });
        removeItemFromRepeater(repeater, event.context.itemId);
        state.communicationsCounts.archive--;
        state.communicationsCounts.all++;
        $item(event)('#uarchiveCommunicationButton').disable();
    });
}

export const reuseCommunication = async (communication) => {
    const reused = resetCommunication(communication);
    reused.draft = true;
    reused.tested = false;
    try {
        const saved = await saveCommunication(reused);
        sendBi('campainOptions', { 'campaignId': communication._id, 'button_name': 'reuse' })
        wixLocation.to(Urls.EXISTS_COMMUNICATION + saved._id)
    } catch (err) {
        console.error('public/communications-dashboard reuse communication ', err);
    }
}

//toDo : import from communication constructor
const resetCommunication = (communication) => {
    const toReturn = { ...communication };
    delete toReturn._id;
    toReturn.sent = false;
    toReturn.draft = false;
    toReturn.archive = false;
    toReturn.isTemplate = false;
    toReturn.targetAudienceCsv = null;
    toReturn.targetAudience = null;
    toReturn.manuallyApprovedUsers = [];
    return toReturn;
}