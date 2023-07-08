import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { autorun } from 'mobx';
import { create } from 'wix-fedops';

import { getAllUserCommunications } from 'backend/data-methods-wrapper.jsw';
import { Text, CommunicationDahboardStates, AllCommunicationDashboardRepeaterButtons, CommunicationActions, Urls } from '../../consts.js';
import { disbaleCurrentButton } from '../helpers.js'
import { SmartRepeater } from '../../smart-repeater.js';
import { getSentCommunications } from '../../audience-handler.js';
import { setCommunicationMoreActionsEvents } from './communication-actions.js';
import { sendBi } from '../../BI/biModule.js';
import { observable, configure, toJS } from 'mobx';

const routerData = wixWindow.getRouterData();

configure({
    useProxies: "never"
})

export const state = observable({
    communicationsCounts: routerData.count,
    // setCreateEmailAvailable(isAvailible) {
    //     state.createEmailAvailable = isAvailible;
    // },
});




const fedopsLogger = create('wix-connect');

export const initCommunicationsDashboardData = () => {
    setMyCommunicationsRepeater();
    setNavigeationBtnsData();
}

const setNavigeationBtnsData = () => {
    autorun((event) => {
        $w('#allButton').label = `${CommunicationDahboardStates.ALL} ${state.communicationsCounts.all}`;
        $w('#sentButton').label = `${CommunicationDahboardStates.SENT} ${state.communicationsCounts.sent}`;
        $w('#draftsButton').label = `${CommunicationDahboardStates.DRAFT} ${state.communicationsCounts.draft}`;
        $w('#archiveButton').label = `${CommunicationDahboardStates.ARCHIVE} ${state.communicationsCounts.archive}`;
    })
}

const setMyCommunicationsRepeater = async () => {
    $w('#myCommunicationsRepeater').hide();
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
    const smartCommunictionsRepeater = new SmartRepeater($w('#myCommunicationsRepeater'), $w('#myCommunicationItemBox'), getAllUserCommunications, filters, itemReadyFun);
    smartCommunictionsRepeater.initRepeater();

    setNavigeationBtnsEvents(smartCommunictionsRepeater);
    $w('#myCommunicationsRepeater').show();

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
        fedopsLogger.interactionStarted('my-communications-all');
        updateRepeater(repeater, { "sent": true, "draft": true }, 'allButton');
        sendBi('thirdMenu', { 'button_name': 'all_button' })
        fedopsLogger.interactionEnded('my-communications-all');
    })
    $w('#sentButton').onClick((event) => {
        fedopsLogger.interactionStarted('my-communications-sent');
        updateRepeater(repeater, { 'sent': true }, 'sentButton');
        sendBi('thirdMenu', { 'button_name': 'sent_button' })
        fedopsLogger.interactionEnded('my-communications-sent');
    })
    $w('#draftsButton').onClick((event) => {
        fedopsLogger.interactionStarted('my-communications-draft');
        updateRepeater(repeater, { 'draft': true }, 'draftsButton');
        sendBi('thirdMenu', { 'button_name': 'drafts_button' })
        fedopsLogger.interactionEnded('my-communications-draft');
    })
    $w('#archiveButton').onClick((event) => {
        fedopsLogger.interactionStarted('my-communications-archive');
        updateRepeater(repeater, { 'archive': true }, 'archiveButton');
        sendBi('thirdMenu', { 'button_name': 'archive_button' })
        fedopsLogger.interactionEnded('my-communications-archive');
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

export const prepareSentCommunicationsDetails = async (communicationDetails) => {
    try {
        if (!communicationDetails)
            communicationDetails = await getSentCommunications();
        const aggregatedData = aggregateByComuunicationId(communicationDetails.data.marketingData);
        return aggregatedData;
    } catch (err) {
        throw new Error('initPreviewDetailsHeaderData, couldnt get sent communication Details, original error: ' + err)
    }
}

const aggregateByComuunicationId = (data) => {
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