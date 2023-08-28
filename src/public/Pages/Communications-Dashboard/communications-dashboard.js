// @ts-ignore
import wixLocation from 'wix-location';
// @ts-ignore
import wixSiteFrontend from 'wix-site-frontend';

import { autorun, isObservable, toJS } from 'mobx';

import { disbaleCurrentButton } from '../helpers.js';
import { getSentCommunications } from '../../audience-handler.js';
import { setCommunicationMoreActionsEvents } from './communication-actions.js';
import { sendBi } from '../../BI/biModule.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import { state } from './state-manager.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';

// @ts-ignore
import { createCommunication } from 'backend/data-methods-wrapper.jsw';


export const isDraftOrSent = communication => communication.sent || communication.draft;
export const isTemplateOrArchive = communication => communication.isTemplate || communication.archive;

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

export const formatDate = (dateObj) => isObservable(dateObj) ? new Date(toJS(dateObj).$date) : new Date(dateObj);

const setNavigeationBtnsData = () => {
    autorun((event) => {
        let countSents = 0;
        let countDrafts = 0;
        let countArchives = 0;
        let countAll = 0;


        for (let index = 0; index < state.communications.length; index++) {
            const communication = state.communications[index];
            if (!isTemplateOrArchive(communication) && isDraftOrSent(communication)) {

                countAll++;
            }

            if (communication.archive) {
                countArchives++
                continue;
            }

            if (communication.sent) {
                countSents++;
                continue;
            }

            if (communication.draft) {
                countDrafts++;
                continue;
            }

        }

        Comp.allButton.label = `${constants.CommunicationDahboardStates.ALL} ${countAll}`;
        Comp.sentButton.label = `${constants.CommunicationDahboardStates.SENT} ${countSents}`;
        Comp.draftsButton.label = `${constants.CommunicationDahboardStates.DRAFT} ${countDrafts}`;
        Comp.archiveButton.label = `${constants.CommunicationDahboardStates.ARCHIVE} ${countArchives}`;
    })
}

const setMyCommunications = async () => {
    Comp.myCommunicationsButton.disable();



    Comp.myCommunicationsRepeater.data = [];

    const communicationDetails = await prepareSentCommunicationsDetails(state.communicationDetails);

    Comp.myCommunicationsRepeater.onItemReady(($item, itemData, index) => {
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
    });


    setAllCommunication();
    setCommunicationMoreActionsEvents();
    setNavigeationBtnsEvents();

}

function setAllCommunication() {
    const emptyState = () => Comp.dashboardMultiState.changeState(Comp.States.emptyState);
    const myCommunicationsState = () => Comp.dashboardMultiState.changeState(Comp.States.myCommunicationsState);
    const filteredItems = state.communications.filter((item) => isDraftOrSent(item) && !isTemplateOrArchive(item));
    if (filteredItems.length > 0) {
        Comp.myCommunicationsRepeater.data = filteredItems;
        myCommunicationsState();
    } else {
        emptyState();
    }
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

    const date = formatDate(itemData._updatedDate);
    //toDo: BUG sent on isn't the updateDate;
    $item('#dateLabelText').text = constants.Text.SENT_ON + date;
    $item('#dateLabelText').show();
}

const setUnsentCommunicationUI = ($item, itemData) => {
    $item('#sentLabelBox').hide() && $item('#sentDetailsBox').hide() &&
        $item('#draftLabelBox').show() && $item('#wasntSendText').show();

    const date = formatDate(itemData._updatedDate);
    $item('#dateLabelText').text = constants.Text.EDITED_ON + date;
}

const setCommunicationActionsOptions = ($item, itemData) => {
    const buttonsList = itemData.archive ? constants.CommunicationActions.Archive :
        itemData.sent ? constants.CommunicationActions.Sent : constants.CommunicationActions.Draft;
    (buttonsList).forEach(button => {
        $item(button).collapsed && $item(button).expand();
    });
}

const setNavigeationBtnsEvents = () => {


    Comp.allButton.onClick((event) => {

        disbaleCurrentButton('allButton', constants.AllCommunicationDashboardRepeaterButtons);

        Comp.myCommunicationsRepeater.date = [];
        Fedops.interactionStarted(Fedops.events.myCommunicationsAll);
        setAllCommunication();
        sendBi('thirdMenu', { 'button_name': 'all_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsAll);

    })

    Comp.sentButton.onClick((event) => {
        disbaleCurrentButton('sentButton', constants.AllCommunicationDashboardRepeaterButtons);

        Comp.myCommunicationsRepeater.data = [];
        Fedops.interactionStarted(Fedops.events.myCommunicationsSent);
        const filteredItems = state.communications.filter((item) => item.sent && !isTemplateOrArchive(item));
        Comp.myCommunicationsRepeater.data = filteredItems;
        sendBi('thirdMenu', { 'button_name': 'sent_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsSent);

    })

    Comp.draftsButton.onClick((event) => {

        disbaleCurrentButton('draftsButton', constants.AllCommunicationDashboardRepeaterButtons);

        Comp.myCommunicationsRepeater.data = [];
        Fedops.interactionStarted(Fedops.events.myCommunicationsDraft);
        const filteredItems = state.communications.filter((item) => item.draft && !isTemplateOrArchive(item));
        Comp.myCommunicationsRepeater.data = filteredItems;
        sendBi('thirdMenu', { 'button_name': 'drafts_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsDraft);

    })

    Comp.archiveButton.onClick((event) => {

        disbaleCurrentButton('archiveButton', constants.AllCommunicationDashboardRepeaterButtons);

        Comp.myCommunicationsRepeater.data = [];
        Fedops.interactionStarted(Fedops.events.myCommunicationsArchive);
        const filteredItems = state.communications.filter((item) => item.archive);
        Comp.myCommunicationsRepeater.data = filteredItems;
        sendBi('thirdMenu', { 'button_name': 'archive_button' })
        Fedops.interactionEnded(Fedops.events.myCommunicationsArchive);

    })
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

