import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

import { Urls, AllMainDashboardButtons } from '../../consts.js';
import { disbaleCurrentButton } from '../helpers.js';
import { sendBi } from '../../BI/biModule.js';

import { createCommunication } from 'backend/data-methods-wrapper.jsw';
import * as Fedops from '../../wix-fedops-api.js';

export const initTopBardActions = () => {
    setTopBarButtonsEvents();
}

export const setTopBarButtonsEvents = () => {
    $w('#myCommunicationsButton').onClick((event) => {
        $w('#dashboardMultiState').changeState('myCommunicationsState');
        disbaleCurrentButton('myCommunicationsButton', AllMainDashboardButtons);
        sendBi('subMenu', { 'button_name': 'myCommunicationsButton' })
    });

    $w('#myTemplatesButton').onClick((event) => {
        $w('#dashboardMultiState').changeState('myTemplatesState');
        disbaleCurrentButton('myTemplatesButton', AllMainDashboardButtons);
        sendBi('subMenu', { 'button_name': 'myTemplatesButton' })
    });

    $w('#createCommunicationButton').onClick(async (event) => {
        $w('#createCommunicationButton').disable();
        try {
            Fedops.interactionStarted(Fedops.events.createNewCommunication);
            const communication = await createCommunication();
            Fedops.interactionEnded(Fedops.events.createNewCommunication);
            sendBi('createCommunication', { 'button_name': 'myTemplatesButton', 'origin': 'upper', 'campainedid': communication._id })
            wixLocation.to(Urls.EXISTS_COMMUNICATION + communication._id);
        } catch (err) {
            console.error('error in createCommunicationButton, original error: ' + err);
            $w('#createCommunicationButton').enable();
        }
    });
    $w('#needHelpButton').onClick((event) => {
        wixWindow.openLightbox('Need Help Sidebar');
    });
}

export const clickCommunicationButton = () => {
    $w('#dashboardMultiState').changeState('myCommunicationsState');
    disbaleCurrentButton('myCommunicationsButton', AllMainDashboardButtons)
}

export const clickTemplatesButton = () => {
    $w('#dashboardMultiState').changeState('myTemplatesState');
    disbaleCurrentButton('myTemplatesButton', AllMainDashboardButtons)
}