// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import wixLocation from 'wix-location';

import { autorun } from 'mobx';

import { state } from './state-management.js';
import { disbaleCurrentButton } from '../helpers.js';
import { targetAudienceState } from './Target-Audience/target-audience.js';
import { sendBi } from '../../BI/biModule.js';
import { redirectToMyCommunications } from '../../_utils.js';

import * as previewHandler from './preview.js';
import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';


export const initTopBarActions = () => {
    setOnClickStepsEvents();
    setClickNextButton();
    setDisabledSendButtonTooltip();
    setStepsOfCreationMultistateBox();
}

export const initTestAndSendData = () => {
    setTopBarData();
}

const setTopBarData = () => {

    $w('#sendStepButton').hide();
    $w('#nextStepButton').show() && $w('#nextStepButton').enable();
    autorun(() => {
        const isCompleteAddDetails = state.communication?.name;
        isCompleteAddDetails ? $w('#addDetailsButton').expandIcon() : $w('#addDetailsButton').collapseIcon()
    });
    autorun(() => {
        let isCompleteTargetAudience = state.communication?.targetAudience;
        if (state.communication?.isTemplate) {
            $w('#targetAudienceButton').disable();
        } else {
            isCompleteTargetAudience ?
                $w('#targetAudienceButton').expandIcon() : $w('#targetAudienceButton').collapseIcon()
        }
    });
    autorun(() => {
        const isCompleteCreateEmail = state.communication?.template?.data?.body;
        isCompleteCreateEmail ? $w('#createEmailButton').expandIcon() : $w('#createEmailButton').collapseIcon()
    });
    autorun(() => {
        const isCompleteTestAndSend = state.communication?.finalDetails?.senderName && state.communication?.finalDetails?.subjectLine &&
            state.communication?.finalDetails?.previewText && state.communication?.finalDetails?.replyToAddress;
        isCompleteTestAndSend ? $w('#testAndSendButton').expandIcon() : $w('#testAndSendButton').collapseIcon()
    });

    autorun(() => {
        const isCompleteTestAndSend = state.communication?.finalDetails?.senderName && state.communication?.finalDetails?.subjectLine &&
            state.communication?.finalDetails?.previewText && state.communication?.finalDetails?.replyToAddress;
        isCompleteTestAndSend ? $w('#testAndSendButton').expandIcon() : $w('#testAndSendButton').collapseIcon()
    });
}

const setDisabledSendButtonTooltip = () => {
    $w('#hoverZoneSendTooltip').onMouseIn((event) => {
        $w('#sendButtonTooltipBox').expand();
    });

    $w('#sendButtonTooltipBox').onMouseOut((event) => {
        $w('#sendButtonTooltipBox').collapse();
    })

    $w('#HeaderEditMode').onMouseOut((event) => {
        $w('#sendButtonTooltipBox').collapse();
    })
}

const setOnClickStepsEvents = () => {
    const buttonslist = state.communication?.isTemplate ? constants.AllEditTemplateBarButton : constants.AllCompuseEmailTopBarButton;
    $w('#addDetailsButton').onClick((event) => {
        $w('#stepsOfCreationMultistateBox').changeState('AddDetailsState');
        disbaleCurrentButton('addDetailsButton', buttonslist);
        handleNextButton('addDetailsButton');
    })
    $w('#targetAudienceButton').onClick((event) => {
        $w('#stepsOfCreationMultistateBox').changeState('TargetAudienceState');
        disbaleCurrentButton('targetAudienceButton', buttonslist);
        handleNextButton('targetAudienceButton');
    })
    $w('#createEmailButton').onClick((event) => {
        $w('#stepsOfCreationMultistateBox').changeState('CreateEmailStep');
        disbaleCurrentButton('createEmailButton', buttonslist);
        handleNextButton('createEmailButton');
    })
    $w('#testAndSendButton').onClick((event) => {

        $w('#stepsOfCreationMultistateBox').changeState('TestAndSendState');
        disbaleCurrentButton('testAndSendButton', buttonslist);
        handleNextButton('testAndSendButton');
    })
    $w('#previewEmailButton').onClick((event) => {
        Fedops.interactionStarted(Fedops.events.previewEmail);
        $w('#mainMultiStateBox').changeState('PreviewState');
        previewHandler.initPreviewData();
        Fedops.interactionEnded(Fedops.events.previewEmail);
        sendBi('upperMenu', { 'button_name': 'preview_email' })
    })
    $w('#backToEditButton').onClick((event) => {
        $w('#mainMultiStateBox').changeState('EditState');
        previewHandler.cleanAllPreviewData();
        sendBi('upperMenu', { 'button_name': 'back_To_Edit' })
    })
    $w('#backToDashboardButton').onClick((event) => {
        sendBi('upperMenu', { 'button_name': 'back_To_Dashboard' })
        if (state.communication.sent) {
            redirectToMyCommunications();
        } else {
            wixWindow.openLightbox(constants.Lightboxs.exitWarning);
        }
    });
    $w('#sendStepButton').onClick(async (event) => {
        $w('#sendStepButton').disable();
        sendBi('upperMenu', { 'button_name': 'send_emails' })
        await wixWindow.openLightbox(constants.Lightboxs.sendCommunication, { state, 'approvedCounter': targetAudienceState.approvedCounter });
        $w('#sendStepButton').enable();
    })

    $w('#sendTestButton').onClick(async (event) => {
        sendBi('upperMenu', { 'button_name': 'send_test_email' })
        await wixWindow.openLightbox(constants.Lightboxs.sendTestEmail, state);       
    })
}

const setStepsOfCreationMultistateBox = () => {

    const addStateToParam = (stateID) => wixLocation.queryParams.add({
        "stepOfCreation": stateID
    });

    $w("#stepsOfCreationMultistateBox").onChange((event) => {
        let currentState = event.target.currentState.id;
        addStateToParam(currentState);
    });

    if (wixLocation.query?.stepOfCreation) {
        $w("#stepsOfCreationMultistateBox").changeState(wixLocation.query.stepOfCreation);
    } else {
        addStateToParam(constants.CommunicationStatesByOrder[0]);
    }
}

const setClickNextButton = () => {
    const buttonslist = state.communication?.isTemplate ? constants.AllEditTemplateBarButton : constants.AllCompuseEmailTopBarButton;
    $w('#nextStepButton').onClick((event) => {
        const nextStepIndex = getNextStepIndex();
        $w('#stepsOfCreationMultistateBox').changeState(constants.CommunicationStatesByOrder[nextStepIndex]);
        disbaleCurrentButton(buttonslist[nextStepIndex], buttonslist);
        handleNextButton(buttonslist[nextStepIndex]);
        sendBi('upperMenu', { 'button_name': 'next' });
    });
}

const handleNextButton = (currStep) => {
    if (currStep === 'testAndSendButton') {
        $w('#nextStepButton').disable();
        $w('#sendStepButton').show();
        if (!$w('#sendStepButton').enabled) {
            $w('#hoverZoneSendTooltip').expand();
        } else {
            $w('#hoverZoneSendTooltip').collapse();
        }
    } else {
        $w('#nextStepButton').enable();
        $w('#sendStepButton').hide();
        $w('#hoverZoneSendTooltip').collapse();
    }
}

const getNextStepIndex = () => {
    const currentStep = $w('#stepsOfCreationMultistateBox').currentState.id;
    for (let i = 0; i < constants.CommunicationStatesByOrder.length - 1; i++) {
        if (constants.CommunicationStatesByOrder[i] === currentStep) {
            return i + 1
        }
    }
}