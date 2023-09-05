// @ts-ignore
import wixLocation from 'wix-location';

import { sendBi } from '../../BI/biModule.js';
import { removeItemFromRepeater } from '../../_utils.js';
import { state } from './state-manager.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import { openBanner } from '../../_utils.js';

import * as constants from '../../consts.js';

// @ts-ignore
import { updateCommunication, saveCommunication } from 'backend/data-methods-wrapper.jsw';

// @ts-ignore
const $item = (event) => $w.at(event.context);

const itemData = (event, repeater) => {
    const data = repeater.data;
    return data.find(item => item._id === event.context.itemId);
}

const sendCampainOptionsBIEvent = (campaignId, buttonName) => {
    const menuName = wixLocation.query.menuName;
    const tabName = wixLocation.query.tabName;
    sendBi('campainOptions', { campaignId, buttonName, menuName, tabName });
}

export const setCommunicationMoreActionsEvents = () => {

    const repeater = Comp.myCommunicationsRepeater;

    Comp.communicationClickbaleArea.onClick((event) => {

        const data = itemData(event, repeater);
        let redirectTo = '';
        if (data.archive)
            return

        if (data.sent)
            redirectTo = constants.Urls.PREVIEW;

        if (data.draft)
            redirectTo = constants.Urls.EXISTS_COMMUNICATION;

        wixLocation.to(redirectTo + event.context.itemId);

    });

    Comp.seeMoreActionsButton.onClick((event) => {
        Comp.communicationActionsbox($item(event)).expand();
    });

    Comp.myCommunicationItemBox.onMouseOut((event) => {
        Comp.communicationActionsbox($item(event)).collapse();
    });

    Comp.editCommunicationButton.onClick((event) => {
        sendCampainOptionsBIEvent(event.context.itemId, 'edit');
        wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + event.context.itemId);
    });

    Comp.reuseCommunicationButton.onClick(async (event) => {
        await reuseCommunication(itemData(event, repeater));
    })

    Comp.saveAsTempalteButton.onClick(async (event) => {
        console.log('Comp.saveAsTempalteButton.onClick');
        event.target.disable();
        Comp.saveAsTempalteButton
        const toSave = resetCommunication(itemData(event, repeater));
        toSave.isTemplate = true;
        const template = await saveCommunication(toSave);
        sendCampainOptionsBIEvent(event.context.itemId, 'reusave_as_templatese');

        event.target.enable();
        state.communications = [template, ...state.communications];
        const newData = [template, ...Comp.myTemplatesRepeater.data];
        Comp.myTemplatesRepeater.data = newData;
        Comp.communicationActionsbox($item(event)).collapse();
        openBanner(constants.SavedAsTempalteText);
    });

    Comp.archiveCommunicationButton.onClick(async (event) => {
        console.log('Comp.archiveCommunicationButton.onClick');
        event.target.disable();
        itemData(event, repeater).archive = true;
        updateCommunication(itemData(event, repeater));
        sendCampainOptionsBIEvent(event.context.itemId, 'archive');
        removeItemFromRepeater(repeater, event.context.itemId);
    });

    Comp.uarchiveCommunicationButton.onClick(async (event) => {
        console.log('Comp.uarchiveCommunicationButton.onClick');
        event.target.disable();
        itemData(event, repeater).archive = false;
        updateCommunication(itemData(event, repeater));
        sendCampainOptionsBIEvent(event.context.itemId, 'unarchive');
        removeItemFromRepeater(repeater, event.context.itemId);

    });

    Comp.deleteCommunicationButton.onClick((event) => {
        console.log('Comp.deleteCommunicationButton.onClick');
        event.target.disable();
        itemData(event, repeater).delete = true;
        updateCommunication(itemData(event, repeater));
        sendCampainOptionsBIEvent(event.context.itemId, 'delete');
        removeItemFromRepeater(repeater, event.context.itemId);
        state.communications = state.communications.filter((item) => item._id !== event.context.itemId);
    })
}

export const reuseCommunication = async (communication) => {
    console.log('reuseCommunication: ', communication);
    const reused = resetCommunication(communication);
    reused.draft = true;
    reused.tested = false;
    try {
        const saved = await saveCommunication(reused);
        sendCampainOptionsBIEvent(communication._id, 'reuse');
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