// @ts-ignore
import wixLocation from 'wix-location';
// @ts-ignore
import wixSiteFrontend from 'wix-site-frontend';

import { debounce } from 'lodash';
import { autorun } from 'mobx';

import { disbaleCurrentButton } from '../helpers.js'
import { SmartRepeater } from '../../smart-repeater.js';
import { getSentCommunications } from '../../audience-handler.js';
import { setCommunicationMoreActionsEvents } from './communication-actions.js';
import { sendBi } from '../../BI/biModule.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import { state } from './state-manager.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';

// @ts-ignore
import { getAllUserCommunications, createCommunication } from 'backend/data-methods-wrapper.jsw';

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
    event.target.disable();
    try {
        Fedops.interactionStarted(Fedops.events.createNewCommunication);
        const communication = await createCommunication();
        Fedops.interactionEnded(Fedops.events.createNewCommunication);
        sendBi('createCommunication', { 'button_name': 'myTemplatesButton', 'origin': 'upper', 'campainedid': communication._id })
        wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + communication._id);
    } catch (err) {
        console.error('error in createCommunicationButton, original error: ' + err);
        event.target.enable();
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
        Comp.allButton.label = `${constants.CommunicationDahboardStates.ALL} ${state.communicationsCounts.all}`;
        Comp.sentButton.label = `${constants.CommunicationDahboardStates.SENT} ${state.communicationsCounts.sent}`;
        Comp.draftsButton.label = `${constants.CommunicationDahboardStates.DRAFT} ${state.communicationsCounts.draft}`;
        Comp.archiveButton.label = `${constants.CommunicationDahboardStates.ARCHIVE} ${state.communicationsCounts.archive}`;
    })
}

const setMyCommunications = async () => {
    Comp.myCommunicationsButton.disable();

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
    const communicationDetails = await prepareSentCommunicationsDetails(state.communicationDetails);
    const filters = { "sent": true, "draft": true };
    const itemReadyFun = ($item, itemData, index) => {

        wixSiteFrontend.prefetchPageResources({
            "pages": [constants.Urls.EXISTS_COMMUNICATION + itemData._id]
        });

        $item('#communicationTitleText').text = itemData.name || constants.Text.NO_NAME;
        (constants.CommunicationActions.All).forEach(button => {
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

    $item('#dateLabelText').text = constants.Text.SENT_ON + new Date(itemData._updatedDate);
    $item('#dateLabelText').show();
}

const setUnsentCommunicationUI = ($item, itemData) => {
    $item('#sentLabelBox').hide() && $item('#sentDetailsBox').hide() &&
        $item('#draftLabelBox').show() && $item('#wasntSendText').show();


    $item('#dateLabelText').text = constants.Text.EDITED_ON + new Date(itemData._updatedDate);
}

const setCommunicationActionsOptions = ($item, itemData) => {
    const buttonsList = itemData.archive ? constants.CommunicationActions.Archive :
        itemData.sent ? constants.CommunicationActions.Sent : constants.CommunicationActions.Draft;
    (buttonsList).forEach(button => {
        $item(button).collapsed && $item(button).expand();
    });
}

const setNavigeationBtnsEvents = (repeater) => {
    const debounced = debounce(async (func) => {
        await func();
    }, 1000);

    Comp.allButton.onClick((event) => {
        disbaleCurrentButton('allButton', constants.AllCommunicationDashboardRepeaterButtons);
        debounced(async () => {
            Fedops.interactionStarted(Fedops.events.myCommunicationsAll);
            await updateRepeater(repeater, { "sent": true, "draft": true },);
            sendBi('thirdMenu', { 'button_name': 'all_button' })
            Fedops.interactionEnded(Fedops.events.myCommunicationsAll);
        })
    })

    Comp.sentButton.onClick((event) => {
        disbaleCurrentButton('sentButton', constants.AllCommunicationDashboardRepeaterButtons);
        debounced(async () => {
            Fedops.interactionStarted(Fedops.events.myCommunicationsSent);
            await updateRepeater(repeater, { 'sent': true },);
            sendBi('thirdMenu', { 'button_name': 'sent_button' })
            Fedops.interactionEnded(Fedops.events.myCommunicationsSent);
        })
    })

    Comp.draftsButton.onClick((event) => {
        disbaleCurrentButton('draftsButton', constants.AllCommunicationDashboardRepeaterButtons);
        debounced(async () => {
            Fedops.interactionStarted(Fedops.events.myCommunicationsDraft);
            await updateRepeater(repeater, { 'draft': true },);
            sendBi('thirdMenu', { 'button_name': 'drafts_button' })
            Fedops.interactionEnded(Fedops.events.myCommunicationsDraft);
        })
    })

    Comp.archiveButton.onClick((event) => {
        disbaleCurrentButton('archiveButton', constants.AllCommunicationDashboardRepeaterButtons);
        debounced(async () => {
            Fedops.interactionStarted(Fedops.events.myCommunicationsArchive);
            await updateRepeater(repeater, { 'archive': true },);
            sendBi('thirdMenu', { 'button_name': 'archive_button' })
            Fedops.interactionEnded(Fedops.events.myCommunicationsArchive);
        })
    })
}

const updateRepeater = async (repeater, filters) => {
    repeater.filters = filters;
    await repeater.resetRepeater();
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

