import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

import { autorun, observable, configure, toJS } from 'mobx';

import { Text, CommunicationDahboardStates, AllCommunicationDashboardRepeaterButtons, CommunicationActions, Urls } from '../../consts.js';
import { disbaleCurrentButton } from '../helpers.js'
import { SmartRepeater } from '../../smart-repeater.js';
import { getSentCommunications } from '../../audience-handler.js';
import { setCommunicationMoreActionsEvents } from './communication-actions.js';
import { sendBi } from '../../BI/biModule.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import * as Fedops from '../../wix-fedops-api.js';

import { getAllUserCommunications, createCommunication } from 'backend/data-methods-wrapper.jsw';

const routerData = wixWindow.getRouterData();

configure({
    useProxies: "never"
})

export const state = observable({
    communicationsCounts: routerData.count,
});

export const initCommunicationsDashboardData = () => {
    setMyCommunications();
    setNavigeationBtnsData();
}

export const setEmptyState = () => {
    Comp.createCommunicationStateButton.onClick((event) => {
        createCommunicationClick(event);
    })
}

export async function createCommunicationClick(event) {
    const clickedElement = event.target;
    clickedElement.disable();
    try {
        Fedops.interactionStarted(Fedops.events.createNewCommunication);
        const communication = await createCommunication();
        Fedops.interactionEnded(Fedops.events.createNewCommunication);
        sendBi('createCommunication', { 'button_name': 'myTemplatesButton', 'origin': 'upper', 'campainedid': communication._id })
        wixLocation.to(Urls.EXISTS_COMMUNICATION + communication._id);
    } catch (err) {
        console.error('error in createCommunicationButton, original error: ' + err);
        clickedElement.enable();
    }
}

export const prepareSentCommunicationsDetails = async (communicationDetails) => {
    try {
        if (!communicationDetails)
            communicationDetails = await getSentCommunications();
        const aggregatedData = aggregateByComuunicationId(communicationDetails?.data?.marketingData);
        return aggregatedData;
    } catch (err) {
        throw new Error('initPreviewDetailsHeaderData, couldnt get sent communication Details, original error: ' + err)
    }
}

const setNavigeationBtnsData = () => {
    autorun((event) => {
        $w('#allButton').label = `${CommunicationDahboardStates.ALL} ${state.communicationsCounts.all}`;
        $w('#sentButton').label = `${CommunicationDahboardStates.SENT} ${state.communicationsCounts.sent}`;
        $w('#draftsButton').label = `${CommunicationDahboardStates.DRAFT} ${state.communicationsCounts.draft}`;
        $w('#archiveButton').label = `${CommunicationDahboardStates.ARCHIVE} ${state.communicationsCounts.archive}`;
    })
}

const setMyCommunications = async () => {

    const emptyState = () => Comp.dashboardMultiState.changeState(Comp.States.emptyState);
    const myCommunicationsState = () => Comp.dashboardMultiState.changeState(Comp.States.myCommunicationsState);

    const getData = (...arg) => getAllUserCommunications(...arg).then((res) => {
        if (res.totalCount > 0) {
            myCommunicationsState();
        } else {
            emptyState();
        }
        return res;
    });

    Comp.myCommunicationsRepeater.hide();
    const communicationDetails = await prepareSentCommunicationsDetails(routerData.communicationDetails);
    const filters = { "sent": true, "draft": true };
    const itemReadyFun = ($item, itemData, index) => {
        $item('#communicationTitleText').text = itemData.name || Text.NO_NAME;
        (CommunicationActions.All).forEach(button => {
            !$item(button).collapsed && $item(button).collapse();
        });

        setCommunicationActionsOptions($item, itemData)
        itemData.sent ? setSentCommunicationUI($item, itemData, communicationDetails) : setUnsentCommunicationUI($item, itemData);
        setCommunicationMoreActionsUI($item);
    };
    setCommunicationMoreActionsEvents();
    const smartCommunictionsRepeater = new SmartRepeater(Comp.myCommunicationsRepeater, Comp.myCommunicationItemBox, getData, filters, itemReadyFun);
    smartCommunictionsRepeater.initRepeater();

    setNavigeationBtnsEvents(smartCommunictionsRepeater);
    Comp.myCommunicationsRepeater.show();

}

const setSentCommunicationUI = async ($item, itemData, communicationDetails) => {
    $item('#deliveredCountText, #openedCountText, #dateLabelText, #openedText, #deliveredText').hide();
    $item('#sentLabelBox').show() && $item('#sentDetailsBox').show() &&
        $item('#draftLabelBox').hide() && $item('#wasntSendText').hide();

    const _id = itemData._id;
    const deliveredCount = communicationDetails[_id]?.delivered ? (communicationDetails[_id]?.delivered).toString() : '0';
    const openedCount = communicationDetails[_id]?.opened ? (communicationDetails[_id]?.opened).toString() : '0';

    if (deliveredCount && openedCount && +deliveredCount != 0) {
        $item('#deliveredCountText').text = deliveredCount;
        $item('#openedCountText').text = openedCount;
        $item('#deliveredCountText, #openedCountText, #dateLabelText, #openedText, #deliveredText').show();
    } else {
        $item('#loadingSentDataBox').show();
    }

    $item('#dateLabelText').text = Text.SENT_ON + new Date(itemData._updatedDate);
    $item('#dateLabelText').show();
}

const setUnsentCommunicationUI = ($item, itemData) => {
    $item('#sentLabelBox').hide() && $item('#sentDetailsBox').hide() &&
        $item('#draftLabelBox').show() && $item('#wasntSendText').show();


    $item('#dateLabelText').text = Text.EDITED_ON + new Date(itemData._updatedDate);
}

const setCommunicationActionsOptions = ($item, itemData) => {
    const buttonsList = itemData.archive ? CommunicationActions.Archive :
        itemData.sent ? CommunicationActions.Sent : CommunicationActions.Draft;
    (buttonsList).forEach(button => {
        $item(button).collapsed && $item(button).expand();
    });
}

const setNavigeationBtnsEvents = (repeater) => {
    $w('#allButton').onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsAll);
        updateRepeater(repeater, { "sent": true, "draft": true }, 'allButton');
        sendBi('thirdMenu', { 'button_name': 'all_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsAll);
    })
    $w('#sentButton').onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsSent);
        updateRepeater(repeater, { 'sent': true }, 'sentButton');
        sendBi('thirdMenu', { 'button_name': 'sent_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsSent);
    })
    $w('#draftsButton').onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsDraft);
        updateRepeater(repeater, { 'draft': true }, 'draftsButton');
        sendBi('thirdMenu', { 'button_name': 'drafts_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsDraft);
    })
    $w('#archiveButton').onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsArchive);
        updateRepeater(repeater, { 'archive': true }, 'archiveButton');
        sendBi('thirdMenu', { 'button_name': 'archive_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsArchive);
    })
}

const updateRepeater = (repeater, filters, buttonClicked) => {
    disbaleCurrentButton(buttonClicked, AllCommunicationDashboardRepeaterButtons);
    repeater.filters = filters;
    repeater.resetRepeater();
}

const setCommunicationMoreActionsUI = ($item) => {
    !$item('#communicationActionsbox').collapsed && $item('#communicationActionsbox').collapse();
}

const aggregateByComuunicationId = (data = []) => {
    const result = {};
    data.forEach((item) => {
        const _id = item._id;
        if (_id in result) {
            result[_id].delivered += parseInt(item.delivered);
            result[_id].opened += parseInt(item.opened);
        } else {
            result[_id] = {
                sent_date: item.sent_date,
                delivered: parseInt(item.delivered),
                opened: parseInt(item.opened),
                _id
            };
        }
    });
    return result;
}

