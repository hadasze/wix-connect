// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import wixLocation from 'wix-location';

import { autorun } from 'mobx';

import { state } from './state-management.js';
import { disbaleCurrentButton } from '../helpers.js';
import { targetAudienceState } from './Target-Audience/target-audience.js';
import { sendBi } from '../../BI/biModule.js';
import { redirectToMyCommunications, updateQuery } from '../../_utils.js';

// @ts-ignore
import { removeCommunication } from 'backend/data-methods-wrapper.jsw';

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
        const isCompleteSetEmailHeader = state.communication?.finalDetails?.senderName && state.communication?.finalDetails?.subjectLine &&
            state.communication?.finalDetails?.previewText && state.communication?.finalDetails?.replyToAddress;
        isCompleteSetEmailHeader ? $w('#setEmailheaderButton').expandIcon() : $w('#setEmailheaderButton').collapseIcon()
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

    $w('#setEmailheaderButton').onClick((event) => {
        $w('#stepsOfCreationMultistateBox').changeState('SetEmailHeaderState');
        disbaleCurrentButton('SetEmailHeaderState', buttonslist);
        handleNextButton('setEmailheaderButton');
    })

    $w('#createEmailButton').onClick((event) => {
        $w('#stepsOfCreationMultistateBox').changeState('CreateEmailState');
        disbaleCurrentButton('createEmailButton', buttonslist);
        handleNextButton('createEmailButton');
    })

    $w('#testAndSendButton').onClick((event) => {
        $w('#stepsOfCreationMultistateBox').changeState('TestAndSendState');
        disbaleCurrentButton('testAndSendButton', buttonslist);
        handleNextButton('testAndSendButton');
    })

    $w('#previewEmailButton').onClick(async (event) => {
        Fedops.interactionStarted(Fedops.events.previewEmail);
        // $w('#mainMultiStateBox').changeState('PreviewState');
        await wixWindow.openLightbox(constants.Lightboxs.PreviewEmail);
        previewHandler.initPreviewData();
        Fedops.interactionEnded(Fedops.events.previewEmail);
        sendBi('upperMenu', { 'buttonName': 'preview_email' })
    })

    // $w('#backToEditButton').onClick((event) => {
    //     $w('#mainMultiStateBox').changeState('EditState');
    //     previewHandler.cleanAllPreviewData();
    //     sendBi('upperMenu', { 'buttonName': 'back_To_Edit' })
    // })

    $w('#backToDashboardButton').onClick(async (event) => {
        $w('#backToDashboardButton').disable();
        sendBi('upperMenu', { 'buttonName': 'back_To_Dashboard' });
        if (!state.communication.draft && !state.communication.sent && !state.communication.delete) {
            removeCommunication(state.communication._id);
        }

        return redirectToMyCommunications();
    });

    $w('#sendStepButton').onClick(async (event) => {
        $w('#sendStepButton').disable();
        sendBi('upperMenu', { 'buttonName': 'send_emails' })
        await wixWindow.openLightbox(constants.Lightboxs.sendCommunication, { state, 'approvedCounter': targetAudienceState.approvedCounter });
        $w('#sendStepButton').enable();
    })

    // $w('#sendTestButton').onClick(async (event) => {
    //     sendBi('upperMenu', { 'buttonName': 'send_test_email' })
    //     await wixWindow.openLightbox(constants.Lightboxs.sendTestEmail, state);
    // })
}

const setStepsOfCreationMultistateBox = () => {

    $w("#stepsOfCreationMultistateBox").onChange((event) => {
        let currentState = event.target.currentState.id;
        updateQuery('stepOfCreation', currentState);
    });

    if (wixLocation.query?.stepOfCreation) {
        $w("#stepsOfCreationMultistateBox").changeState(wixLocation.query.stepOfCreation);
    } else {
        updateQuery('stepOfCreation', constants.CommunicationStatesByOrder[0]);
    }
}

const setClickNextButton = () => {
    const buttonslist = state.communication?.isTemplate ? constants.AllEditTemplateBarButton : constants.AllCompuseEmailTopBarButton;
    $w('#nextStepButton').onClick((event) => {
        const nextStepIndex = getNextStepIndex();
        $w('#stepsOfCreationMultistateBox').changeState(constants.CommunicationStatesByOrder[nextStepIndex]);
        disbaleCurrentButton(buttonslist[nextStepIndex], buttonslist);
        handleNextButton(buttonslist[nextStepIndex]);
        sendBi('upperMenu', { 'buttonName': 'next' });
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