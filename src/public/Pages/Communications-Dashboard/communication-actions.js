// @ts-ignore
import wixLocation from 'wix-location';

import { sendBi } from '../../BI/biModule.js';
import { removeItemFromRepeater } from '../../_utils.js';
import { state } from './state-manager.js';
import * as constants from '../../consts.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';

// @ts-ignore
import { updateCommunication, saveCommunication } from 'backend/data-methods-wrapper.jsw';

// @ts-ignore
const $item = (event) => $w.at(event.context);

const itemData = (event, repeater) => {
    const data = repeater.data;
    return data.find(item => item._id === event.context.itemId);
}

export const setCommunicationMoreActionsEvents = () => {

    const repeater = Comp.myCommunicationsRepeater;

    Comp.communicationClickbaleArea.onClick((event) => {

        const data = itemData(event, repeater)
        if (data.archive)
            return

        if (data.sent)
            wixLocation.to(constants.Urls.PREVIEW + event.context.itemId);

        if (data.draft)
            wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + event.context.itemId);

    });

    Comp.seeMoreActionsButton.onClick((event) => {
        Comp.communicationActionsbox($item(event)).expand();
    });

    Comp.myCommunicationItemBox.onMouseOut((event) => {
        Comp.communicationActionsbox($item(event)).collapse();
    });

    Comp.editCommunicationButton.onClick((event) => {
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'edit' });
        wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + event.context.itemId);
    });

    Comp.reuseCommunicationButton.onClick(async (event) => {
        await reuseCommunication(itemData(event, repeater));
    })

    Comp.saveAsTempalteButton.onClick(async (event) => {
        event.target.disable();
        Comp.saveAsTempalteButton
        const toSave = resetCommunication(itemData(event, repeater));
        toSave.isTemplate = true;
        const template = await saveCommunication(toSave);
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'reusave_as_templatese' });
        event.target.enable();
        state.communicationsCounts.templates++;
        const newData = [template, ...Comp.myTemplatesRepeater.data];
        Comp.myTemplatesRepeater.data = newData;
        Comp.communicationActionsbox($item(event)).collapse();
    });

    Comp.archiveCommunicationButton.onClick(async (event) => {
        event.target.disable();
        itemData(event, repeater).archive = true;
        updateCommunication(itemData(event, repeater));
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'archive' });
        removeItemFromRepeater(repeater, event.context.itemId);
        state.communicationsCounts.archive++;
        state.communicationsCounts.all--;
    });

    Comp.uarchiveCommunicationButton.onClick(async (event) => {
        event.target.disable();
        itemData(event, repeater).archive = false;
        updateCommunication(itemData(event, repeater));
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'unarchive' });
        removeItemFromRepeater(repeater, event.context.itemId);
        state.communicationsCounts.archive--;
        state.communicationsCounts.all++;
    });

    Comp.deleteCommunicationButton.onClick((event) => {
        event.target.disable();
        itemData(event, repeater).delete = true;
        updateCommunication(itemData(event, repeater));
        sendBi('campainOptions', { 'campaignId': event.context.itemId, 'button_name': 'delete' });
        removeItemFromRepeater(repeater, event.context.itemId);
        state.communicationsCounts.all--;
    })
}

export const reuseCommunication = async (communication) => {
    const reused = resetCommunication(communication);
    reused.draft = true;
    reused.tested = false;
    try {
        const saved = await saveCommunication(reused);
        sendBi('campainOptions', { 'campaignId': communication._id, 'button_name': 'reuse' })
        wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + saved._id)
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