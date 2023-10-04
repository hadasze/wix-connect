import wixWindow from 'wix-window';
import { initPreviewUIData } from './preview-component.js';

let currCommunication = wixWindow.getRouterData();

export const initTemaplatePreviewData = () => {
    setTemplatePreviewData();
}

export const initTemplatePreviewActions = () => {
    setTemplatePreviewEvents();
}

const setTemplatePreviewData = () => {
    $w('#previewSectionsMultiStateBox').changeState('previewState');
    initPreviewUIData(currCommunication);
}

const setTemplatePreviewEvents = () => {
    $w('#previewButton').disable();
    $w('#detailsButton').hide();
}