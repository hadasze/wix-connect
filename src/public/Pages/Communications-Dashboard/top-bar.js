// @ts-ignore
import wixWindow from 'wix-window';

import { disbaleCurrentButton } from '../helpers.js';
import { sendBi } from '../../BI/biModule.js';
import { createCommunicationClick, myCommunicationsState, myTemplateState } from './communications-dashboard.js';

import { CommunicationDashboardPage as Comp } from '../../components.js';
import * as constants from '../../consts.js';

export const setTopBarButtonsEvents = () => {
    Comp.myCommunicationsButton.onClick((event) => {
        clickCommunicationButton(event);
    });

    Comp.myTemplatesButton.onClick((event) => {
        clickTemplatesButton(event);
    });

    Comp.createCommunicationButton.onClick(async (event) => {
        createCommunicationClick(event);
    });

    Comp.needHelpButton.onClick((event) => {
        wixWindow.openLightbox(constants.Lightboxs.needHelpSidebar);
    });
}

export function clickCommunicationButton(event) {
    disbaleCurrentButton('myCommunicationsButton', constants.AllMainDashboardButtons);
    myCommunicationsState();
    
    //ToDo: validate BI event button name
    sendBi('subMenu', { 'buttonName': 'myCommunicationsButton' });
}

export function clickTemplatesButton(event) {
    disbaleCurrentButton('myTemplatesButton', constants.AllMainDashboardButtons);
    myTemplateState();
   
    //ToDo: validate BI event button name
    sendBi('subMenu', { 'buttonName': 'myTemplatesButton' });
}