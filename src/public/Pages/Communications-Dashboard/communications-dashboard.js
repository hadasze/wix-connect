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
import { updateQuery } from '../../_utils.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';

// @ts-ignore
import { createCommunication } from 'backend/data-methods-wrapper.jsw';


export const isDraftOrSent = communication => communication.sent || communication.draft;
export const isTemplateOrArchive = communication => communication.isTemplate || communication.archive;

export const initCommunicationsDashboardData = () => {
    setMyCommunications();
    autorun((event) => { setNavigeationBtnsData(state.communications); })
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
        const communication = await createCommunication('new');
        Fedops.interactionEnded(Fedops.events.createNewCommunication);
        let buttonName = '';
        switch (event.target.id) {
            case Comp.createCommunicationStateButton.id:
                buttonName = 'Create_Communication_Empty_State_Button';
                break;
            case Comp.createCommunicationButton.id:
                buttonName = 'Create_Communication_Top_Button';
                break;
            default:
                break;
        }
        sendBi('createCommunication', { buttonName, 'campainedid': communication._id })
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
export const myCommunicationsState = () => Comp.dashboardMultiState.changeState(Comp.States.myCommunicationsState);
export const myTemplateState = () => Comp.dashboardMultiState.changeState(Comp.States.myTemplatesState);

const emptyState = () => Comp.dashboardMultiState.changeState(Comp.States.emptyState);
const isTemplateState = (currentState) => currentState === Comp.States.myTemplatesState;

const setNavigeationBtnsData = (communications) => {
    let countSents = 0;
    let countDrafts = 0;
    let countArchives = 0;
    let countAll = 0;
    let countTemplates = 0;



    for (let index = 0; index < communications.length; index++) {
        const communication = communications[index];
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

        if (!communication.archive && communication.isTemplate) {
            countTemplates++;
            continue;
        }

    }

    const currentState = Comp.dashboardMultiState.currentState.id;
    isTemplateState(currentState) ? Comp.sentButton.hide() && Comp.draftsButton.hide() && Comp.archiveButton.hide() && Comp.myCommunicationsButtonBarSeperator.hide() : Comp.sentButton.show() && Comp.draftsButton.show() && Comp.archiveButton.show() && Comp.myCommunicationsButtonBarSeperator.show();

    const countTemplatesText = `${constants.CommunicationDahboardStates.ALL} ${countTemplates.toString()}`;
    const countAllText = `${constants.CommunicationDahboardStates.ALL} ${countAll.toString()}`;

    Comp.allButton.label = isTemplateState(currentState) ? countTemplatesText : countAllText;
    Comp.sentButton.label = `${constants.CommunicationDahboardStates.SENT} ${countSents.toString()}`;
    Comp.draftsButton.label = `${constants.CommunicationDahboardStates.DRAFT} ${countDrafts.toString()}`;
    Comp.archiveButton.label = `${constants.CommunicationDahboardStates.ARCHIVE} ${countArchives.toString()}`;
}

const setMyCommunications = async () => {
    Comp.myCommunicationsButton.disable();
    updateQuery('menuName', constants.DashboardBIMenuNames.myCommunications);

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
    setMultiStateBox();
}

function setAllCommunication() {
    Fedops.interactionStarted(Fedops.events.myCommunicationsAll);
    disbaleCurrentButton('allButton', constants.AllCommunicationDashboardRepeaterButtons);
    Comp.myCommunicationsRepeater.data = [];
    const filteredItems = state.communications.filter((item) => isDraftOrSent(item) && !isTemplateOrArchive(item));
    Comp.myCommunicationsRepeater.data = filteredItems;
    updateQuery('tabName', constants.DashboardBITabNames.all);
    Fedops.interactionEnded(Fedops.events.myCommunicationsAll);
}

function setMultiStateBox() {
    autorun(() => {

        const filteredItems = state.communications.filter((item) => isDraftOrSent(item) && !isTemplateOrArchive(item));
        if (filteredItems.length > 0) {
            myCommunicationsState();
        } else {
            emptyState();
        }
    });

    Comp.dashboardMultiState.onChange((event) => {
        setNavigeationBtnsData(state.communications);
        const menuName = isTemplateState(event.target.currentState.id) ? constants.DashboardBIMenuNames.myTemplates : constants.DashboardBIMenuNames.myCommunications;
        updateQuery('menuName', menuName);
        if (isTemplateState(event.target.currentState.id)) {
            updateQuery('tabName', constants.DashboardBITabNames.all);
            Comp.allButton.disable();
        } else {
            setAllCommunication();
        }

    });

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
    //toDo: BUG! "sent on" isn't the updateDate;
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
        sendBi('thirdMenu', { 'buttonName': 'all_button' });
        setAllCommunication();
    })

    Comp.sentButton.onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsSent);
        disbaleCurrentButton('sentButton', constants.AllCommunicationDashboardRepeaterButtons);
        Comp.myCommunicationsRepeater.data = [];
        const filteredItems = state.communications.filter((item) => item.sent && !isTemplateOrArchive(item));
        Comp.myCommunicationsRepeater.data = filteredItems;
        sendBi('thirdMenu', { 'buttonName': 'sent_button' });
        updateQuery('tabName', constants.DashboardBITabNames.all);
        Fedops.interactionEnded(Fedops.events.myCommunicationsSent);

    })

    Comp.draftsButton.onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsDraft);
        disbaleCurrentButton('draftsButton', constants.AllCommunicationDashboardRepeaterButtons);
        Comp.myCommunicationsRepeater.data = [];
        const filteredItems = state.communications.filter((item) => item.draft && !isTemplateOrArchive(item));
        Comp.myCommunicationsRepeater.data = filteredItems;
        sendBi('thirdMenu', { 'buttonName': 'drafts_button' });
        updateQuery('tabName', constants.DashboardBITabNames.draft);
        Fedops.interactionEnded(Fedops.events.myCommunicationsDraft);

    })

    Comp.archiveButton.onClick((event) => {
        Fedops.interactionStarted(Fedops.events.myCommunicationsArchive);
        disbaleCurrentButton('archiveButton', constants.AllCommunicationDashboardRepeaterButtons);
        Comp.myCommunicationsRepeater.data = [];
        const filteredItems = state.communications.filter((item) => item.archive);
        Comp.myCommunicationsRepeater.data = filteredItems;
        sendBi('thirdMenu', { 'buttonName': 'archive_button' });
        updateQuery('tabName', constants.DashboardBITabNames.archive);
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

