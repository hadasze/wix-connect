import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { Text, CommunicationDahboardStates, AllCommunicationDashboardRepeaterButtons, CommunicationActions, Urls } from 'public/consts.js';
import { disbaleCurrentButton } from 'public/Pages/helpers.js'
import { SmartRepeater } from 'public/smart-repeater.js';
import { getSentCommunicationData } from 'public/audience-handler.js';
import { getAllUserCommunications } from 'backend/data-methods-wrapper.jsw';
import { setCommunicationMoreActionsEvents } from 'public/Pages/Communications-Dashboard/communication-actions.js';
import { sendBi } from '../../BI/biModule.js';
import { create } from 'wix-fedops';
const fedopsLogger = create('wix-connect');

const routerData = wixWindow.getRouterData();

export const initCommunicationsDashboardData = () => {
    setMyCommunicationsRepeater();
    setNavigeationBtnsData();
}

const setNavigeationBtnsData = () => {
    $w('#allButton').label = `${CommunicationDahboardStates.ALL} ${routerData.all}`;
    $w('#sentButton').label = `${CommunicationDahboardStates.SENT} ${routerData.sent}`;
    $w('#draftsButton').label = `${CommunicationDahboardStates.DRAFT} ${routerData.draft}`;
    $w('#archiveButton').label = `${CommunicationDahboardStates.ARCHIVE} ${routerData.archive}`;
}

const setMyCommunicationsRepeater = async () => {
    $w('#myCommunicationsRepeater').hide()
    const communicationDetails = await prepareSentCommunicationsDetails();
    const filters = { "sent": true, "draft": true };
    const itemReadyFun = ($item, itemData, index) => {
        $item('#communicationTitleText').text = itemData.name || Text.NO_NAME;
        (CommunicationActions.All).forEach(button => {
            !$item(button).collapsed && $item(button).collapse();
        });

        setCommunicationActionsOptions($item, itemData)
        itemData.sent ? setSentCommunicationUI($item, itemData, communicationDetails) : setUnsentCommunicationUI($item, itemData);
        setCommunicationMoreActionsUI($item);
        setCommunicationMoreActionsEvents($item, itemData);
    }
    const smartCommunictionsRepeater = new SmartRepeater($w('#myCommunicationsRepeater'), $w('#myCommunicationItemBox'), getAllUserCommunications, filters, itemReadyFun);
    smartCommunictionsRepeater.initRepeater();

    setNavigeationBtnsEvents(smartCommunictionsRepeater);
    $w('#myCommunicationsRepeater').show()

}

const setSentCommunicationUI = async ($item, itemData, communicationDetails) => {
    $item('#deliveredCountText, #openedCountText, #dateLabelText, #openedText, #deliveredText').hide();
    $item('#sentLabelBox').show() && $item('#sentDetailsBox').show() &&
        $item('#draftLabelBox').hide() && $item('#wasntSendText').hide();

    $item('#communicationClickbaleArea').onClick(() => {
        wixLocation.to(Urls.PREVIEW + itemData._id)
    })
    const id = itemData._id;
    const deliveredCount = communicationDetails[id]?.delivered ? (communicationDetails[id]?.delivered).toString() : '0';
    const openedCount = communicationDetails[id]?.opened ? (communicationDetails[id]?.opened).toString() : '0';

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

    $item('#communicationClickbaleArea').onClick(() => {
        wixLocation.to(Urls.EXISTS_COMMUNICATION + itemData._id)
    })
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
    $item('#seeMoreActionsButton').onClick((event) => {
        $item('#communicationActionsbox').expand();
    })
    $item('#myCommunicationItemBox').onMouseOut((event) => {
        $item('#communicationActionsbox').collapse();
    })
}

export const prepareSentCommunicationsDetails = async () => {
    try {
        const communicationDetails = await getSentCommunicationData();
        const aggregatedData = aggregateByCommunicationId(communicationDetails.data.marketingData);
        return aggregatedData;
    } catch (err) {
        throw new Error('initPreviewDetailsHeaderData, couldnt get sent communication Details, original error: ' + err)
    }
}

const aggregateByCommunicationId = (data) => {
    const result = {};
    data.forEach((item) => {
        const id = item.communicationId;
        if (id in result) {
            result[id].delivered += parseInt(item.delivered);
            result[id].opened += parseInt(item.opened);
        } else {
            result[id] = {
                sent_date: item.sent_date,
                delivered: parseInt(item.delivered),
                opened: parseInt(item.opened),
                _id: item._id,
            };
        }
    });
    return result;
}