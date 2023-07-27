import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

import { Urls, AllMainDashboardButtons } from '../../consts.js';
import { disbaleCurrentButton } from '../helpers.js';
import { sendBi } from '../../BI/biModule.js';
import { createCommunicationClick } from './communications-dashboard.js';

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

        createCommunicationClick(event);

      
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