import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { autorun } from 'mobx';
import { state } from 'public/Pages/Communication/state-management.js';
import * as previewHandler from 'public/Pages/Communication/preview.js';
import { disbaleCurrentButton } from 'public/Pages/helpers.js';
import { sendEmails, sendTestEmail } from 'public/user-mailer';
import { AllCompuseEmailTopBarButton, AllEditTemplateBarButton, Text, Urls, CommunicationStatesByOrder } from 'public/consts.js';
import { targetAudienceState } from 'public/Pages/Communication/Target-Audience/target-audience.js';
import { create } from 'wix-fedops';
import { sendBi } from '../../BI/biModule.js';

const fedopsLogger = create('wix-connect');

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
    const buttonslist = state.communication?.isTemplate ? AllEditTemplateBarButton : AllCompuseEmailTopBarButton;
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
        fedopsLogger.interactionStarted('preview-email');
        $w('#mainMultiStateBox').changeState('PreviewState');
        previewHandler.initPreviewData();
        fedopsLogger.interactionEnded('preview-email');
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
            wixLocation.to(Urls.MY_COMMUNICATIONS_DASHOBOARD);
        } else {
            wixWindow.openLightbox('Edit Email - Exit Warning Popup');
        }
    });
    $w('#sendStepButton').onClick(async (event) => {
        fedopsLogger.interactionStarted('send-email');
        sendBi('upperMenu', { 'button_name': 'send_emails' })
        const recivedData = await wixWindow.openLightbox('Setup & Publish – Send Communication Pop', { 'communication': state.communication, 'approvedCounter': targetAudienceState.approvedCounter });
        if (recivedData?.buttonName === Text.SEND) {
            sendEmails(state.communication);
            fedopsLogger.interactionEnded('send-email');
        }
    })

    $w('#sendTestButton').onClick(async (event) => {
        fedopsLogger.interactionStarted('send-test-email');
        sendBi('upperMenu', { 'button_name': 'send_test_email' })
        const recivedData = await wixWindow.openLightbox('Setup & Publish - Send Test Email Popup', { 'communication': state.communication });
        if (recivedData?.email) {
            sendTestEmail(recivedData.email, state.communication);
            $w('#hoverZoneSendTooltip').hide();
            fedopsLogger.interactionEnded('send-test-email');
        }
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

    if (wixLocation.queryParams.stepOfCreation) {
        $w("#stepsOfCreationMultistateBox").changeState(wixLocation.queryParams.stepOfCreation);
    } else {
        addStateToParam(CommunicationStatesByOrder[0]);
    }
}

const setClickNextButton = () => {
    const buttonslist = state.communication?.isTemplate ? AllEditTemplateBarButton : AllCompuseEmailTopBarButton;
    $w('#nextStepButton').onClick((event) => {
        const nextStepIndex = getNextStepIndex();
        $w('#stepsOfCreationMultistateBox').changeState(CommunicationStatesByOrder[nextStepIndex]);
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
    for (let i = 0; i < CommunicationStatesByOrder.length - 1; i++) {
        if (CommunicationStatesByOrder[i] === currentStep) {
            return i + 1
        }
    }
}