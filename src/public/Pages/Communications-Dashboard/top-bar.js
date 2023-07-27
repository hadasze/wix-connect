// @ts-ignore
import wixWindow from 'wix-window';

import { disbaleCurrentButton } from '../helpers.js';
import { sendBi } from '../../BI/biModule.js';
import { createCommunicationClick } from './communications-dashboard.js';
import * as constants from '../../consts.js';

export const initTopBardActions = () => {
    setTopBarButtonsEvents();
}

export const setTopBarButtonsEvents = () => {
    $w('#myCommunicationsButton').onClick((event) => {
        $w('#dashboardMultiState').changeState('myCommunicationsState');
        disbaleCurrentButton('myCommunicationsButton', constants.AllMainDashboardButtons);
        sendBi('subMenu', { 'button_name': 'myCommunicationsButton' })
    });

    $w('#myTemplatesButton').onClick((event) => {
        $w('#dashboardMultiState').changeState('myTemplatesState');
        disbaleCurrentButton('myTemplatesButton', constants.AllMainDashboardButtons);
        sendBi('subMenu', { 'button_name': 'myTemplatesButton' })
    });

    $w('#createCommunicationButton').onClick(async (event) => {

        createCommunicationClick(event);

      
    });
    $w('#needHelpButton').onClick((event) => {
        wixWindow.openLightbox(constants.Lightboxs.needHelpSidebar);
    });
}

export const clickCommunicationButton = () => {
    $w('#dashboardMultiState').changeState('myCommunicationsState');
    disbaleCurrentButton('myCommunicationsButton', constants.AllMainDashboardButtons)
}

export const clickTemplatesButton = () => {
    $w('#dashboardMultiState').changeState('myTemplatesState');
    disbaleCurrentButton('myTemplatesButton', constants.AllMainDashboardButtons)
}