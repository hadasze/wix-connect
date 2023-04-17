import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import { reuseCommunication } from 'public/Pages/Communications-Dashboard/communication-actions.js';
import { Text, Urls } from 'public/consts.js';
import * as communicationPreviewHandler from 'public/Pages/Preview/communication-preview.js';
import * as templatePreviewHandler from 'public/Pages/Preview/template-preview.js';
import { sendBi } from '../../BI/biModule.js';

let currCommunication = wixWindow.getRouterData();

export const initHeadlineData = () => {
    setHeadlineData();
    setBodyData();
}

export const initHeadlineActions = () => {
    setHeadlineEvents();
}

const setHeadlineData = () => {
    $w('#communicationTitleText').text = currCommunication?.name || '';
    $w('#sentOnDateText').text = currCommunication.sent ? Text.SENT_ON + new Date(`${currCommunication?._updatedDate.$date || ''}`) :
        Text.EDITED_ON + new Date(`${currCommunication?._updatedDate.$date || ''}`);
    $w('#communicationDescriptionText').text = currCommunication?.description || '';
    currCommunication.isTemplate ?
        $w('#reuseBtn').label = Text.REUSE_TEMPLATE : $w('#reuseBtn').label = Text.REUSE_COMMUNICATION;

}

const setHeadlineEvents = () => {
    $w('#reuseBtn').onClick((event) => {
        if (currCommunication.isTemplate)
            sendBi('templateView', { 'campaignId': currCommunication._id, 'button_name': 'reuse_template' })
        reuseCommunication(currCommunication)
    });

    $w('#backButton').onClick((event) => {
        wixLocation.to(Urls.MY_COMMUNICATIONS_DASHOBOARD);
    });
    setBodyEvents();
}

const setBodyEvents = () => {
    currCommunication.isTemplate ? templatePreviewHandler.initTemplatePreviewActions() : communicationPreviewHandler.initCommunicationPreviewActions()
}

const setBodyData = () => {
    currCommunication.isTemplate ? templatePreviewHandler.initTemaplatePreviewData() : communicationPreviewHandler.initCommunicationPreviewData()

}