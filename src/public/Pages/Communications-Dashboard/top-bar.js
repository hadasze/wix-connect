import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import { Urls, AllMainDashboardButtons } from 'public/consts.js';
import { disbaleCurrentButton } from 'public/Pages/helpers.js';
import { createCommunication, saveCommunication } from 'backend/data-methods-wrapper.jsw';
import { sendBi } from '../../BI/biModule.js';
import { create } from 'wix-fedops';
const fedopsLogger = create('wix-connect');

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
        console.time("create communication")
        try {
            fedopsLogger.interactionStarted('create-new-communication');
            const communication = await createCommunication();
            fedopsLogger.interactionEnded('create-new-communication');
            sendBi('createCommunication', { 'button_name': 'myTemplatesButton', 'origin': 'upper', 'campainedid': communication._id })
            console.timeEnd("create communication")
            wixLocation.to(Urls.EXISTS_COMMUNICATION + communication._id);
        } catch (err) {
            console.error('error in createCommunicationButton, original error: ' + err);
            $w('#createCommunicationButton').enable();
        }
    });
    $w('#needHelpButton').onClick((event) => {
        // sendBi('needHelp', {})
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