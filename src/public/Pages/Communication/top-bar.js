// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import wixLocation from 'wix-location';
import { autorun } from 'mobx';

import { state } from './state-management.js';
import { disbaleCurrentButton as _disbaleCurrentButton } from '../helpers.js';
import { targetAudienceState } from './Target-Audience/target-audience.js';
import { sendBi } from '../../BI/biModule.js';
import { redirectToMyCommunications, updateQuery } from '../../_utils.js';
import { CommunicationPage as Comp } from '../../components.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';


// @ts-ignore
import { removeCommunication } from 'backend/data-methods-wrapper.jsw';

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

    Comp.sendStepButton.hide();
    Comp.nextStepButton.show();
    Comp.nextStepButton.enable();

    autorun(() => {
        const isCompleteAddDetails = state.communication?.name?.length > 1;
        isCompleteAddDetails ? Comp.addDetailsButton.expandIcon() : Comp.addDetailsButton.collapseIcon();
    });

    autorun(() => Comp.sendStepButton.label = `Send to ${targetAudienceState.approvedCounter || '0'} Users`);

    autorun(() => {
        let isCompleteTargetAudience = state.communication?.targetAudience;

        if (state.communication?.isTemplate) {
            Comp.targetAudienceButton.disable();
        } else {
            isCompleteTargetAudience ?
                Comp.targetAudienceButton.expandIcon() : Comp.targetAudienceButton.collapseIcon();
        }
    });

    autorun(() => {
        console.log(state.communication?.finalDetails?.senderName?.length);
        const isCompleteSetEmailHeader = state.communication?.finalDetails?.senderName?.length > 1 && state.communication?.finalDetails?.subjectLine?.length > 1 && state.communication?.finalDetails?.replyToAddress?.length > 1;

        console.log({ isCompleteSetEmailHeader });
        isCompleteSetEmailHeader ? Comp.setEmailheaderButton.expandIcon() : Comp.setEmailheaderButton.collapseIcon();
    });

    autorun(() => {
        const isCompleteCreateEmail = state.communication?.template?.data?.body?.length > 1 && state.communication?.finalDetails?.senderName?.length > 1 && state.communication?.finalDetails?.subjectLine?.length > 1 && state.communication?.finalDetails?.replyToAddress?.length > 1;
        console.log({ isCompleteCreateEmail });
        isCompleteCreateEmail ? (Comp.createEmailButton.expandIcon(), Comp.previewOrSendTestEmailButton.enable()) : (Comp.createEmailButton.collapseIcon(), Comp.previewOrSendTestEmailButton.disable());
    });

    autorun(() => {
        const isCompleteTestAndSend = state.communication?.finalDetails?.senderName?.length > 1 && state.communication?.finalDetails?.subjectLine?.length > 1 &&
            state.communication?.finalDetails?.previewText?.length > 1 && state.communication?.finalDetails?.replyToAddress?.length > 1;
        isCompleteTestAndSend ? Comp.testAndSendButton.expandIcon() : Comp.testAndSendButton.collapseIcon()
    });
}

const setDisabledSendButtonTooltip = () => {
    Comp.hoverZoneSendTooltip.onMouseIn((event) => {
        Comp.sendButtonTooltipBox.expand();
    });

    Comp.sendButtonTooltipBox.onMouseOut((event) => {
        Comp.sendButtonTooltipBox.collapse();
    })

    Comp.headerEditMode.onMouseOut((event) => {
        Comp.sendButtonTooltipBox.collapse();
    })
}

const setOnClickStepsEvents = () => {
    const buttonslist = state.communication?.isTemplate ? constants.AllEditTemplateBarButton : constants.AllCompuseEmailTopBarButton;
    const disbaleCurrentButton = (event) => _disbaleCurrentButton(event.target.id, buttonslist);

    Comp.addDetailsButton.onClick((event) => {
        console.log(event.target.id);
        Comp.stepsOfCreationMultistateBox.changeState(Comp.States.AddDetailsState);
        disbaleCurrentButton(event);
        handleNextButton('addDetailsButton');
    })

    Comp.targetAudienceButton.onClick((event) => {
        Comp.stepsOfCreationMultistateBox.changeState(Comp.States.TargetAudienceState);
        disbaleCurrentButton(event);
        handleNextButton('targetAudienceButton');
    })

    Comp.setEmailheaderButton.onClick((event) => {
        Comp.stepsOfCreationMultistateBox.changeState(Comp.States.SetEmailHeaderState);
        disbaleCurrentButton(event);
        handleNextButton('setEmailheaderButton');
    })

    Comp.createEmailButton.onClick((event) => {
        Comp.stepsOfCreationMultistateBox.changeState(Comp.States.CreateEmailState);
        disbaleCurrentButton(event);
        handleNextButton('createEmailButton');
    })

    Comp.testAndSendButton.onClick((event) => {
        // previewHandler.initPreviewData();
        Comp.stepsOfCreationMultistateBox.changeState(Comp.States.TestAndSendState);
        disbaleCurrentButton(event);
        handleNextButton('testAndSendButton');
    })

    Comp.previewOrSendTestEmailButton.onClick(async (event) => {
        event.target.disable();
        const currentState = Comp.stepsOfCreationMultistateBox.currentState.id;
        switch (currentState) {
            case Comp.States.CreateEmailState:
                sendBi('upperMenu', { 'buttonName': 'preview_email' });
                Fedops.interactionStarted(Fedops.events.previewEmail);
                await wixWindow.openLightbox(constants.Lightboxs.PreviewEmail, { state, targetAudienceState });
                Fedops.interactionEnded(Fedops.events.previewEmail);
                break;

            case Comp.States.TestAndSendState:
                sendBi('upperMenu', { 'buttonName': 'send_test_email' })
                await wixWindow.openLightbox(constants.Lightboxs.sendTestEmail, state);
                break;

            default:

                break;
        }
        event.target.enable();

    })

    Comp.backToDashboardButton.onClick(async (event) => {
        Comp.backToDashboardButton.disable();
        sendBi('upperMenu', { 'buttonName': 'back_To_Dashboard' });
        if (!state.communication.draft && !state.communication.sent && !state.communication.delete) {
            removeCommunication(state.communication._id);
        }

        return redirectToMyCommunications();
    });

    Comp.sendStepButton.onClick(async (event) => {
        Comp.sendStepButton.disable();
        sendBi('upperMenu', { 'buttonName': 'send_emails' })
        await wixWindow.openLightbox(constants.Lightboxs.sendCommunication, { state, 'approvedCounter': targetAudienceState.approvedCounter });
        Comp.sendStepButton.enable();
    })

}

const setStepsOfCreationMultistateBox = () => {

    Comp.stepsOfCreationMultistateBox.onChange((event) => {
        let currentState = event.target.currentState.id;

        switch (currentState) {
            case Comp.States.CreateEmailState:
                Comp.previewOrSendTestEmailButton.label = 'Preview Email';
                Comp.previewOrSendTestEmailButton.expand();
                break;

            case Comp.States.TestAndSendState:
                Comp.previewOrSendTestEmailButton.label = 'Send Test Email';
                Comp.previewOrSendTestEmailButton.expand();
                break;

            default:
                Comp.previewOrSendTestEmailButton.collapse();
                break;
        }
        updateQuery('stepOfCreation', currentState);
    });

    if (wixLocation.query?.stepOfCreation) {
        Comp.stepsOfCreationMultistateBox.changeState(wixLocation.query.stepOfCreation);
    } else {
        updateQuery('stepOfCreation', constants.CommunicationStatesByOrder[0]);
    }
}

const setClickNextButton = () => {
    const buttonslist = state.communication?.isTemplate ? constants.AllEditTemplateBarButton : constants.AllCompuseEmailTopBarButton;

    Comp.nextStepButton.onClick((event) => {
        const nextStepIndex = getNextStepIndex();
        Comp.stepsOfCreationMultistateBox.changeState(constants.CommunicationStatesByOrder[nextStepIndex]);
        _disbaleCurrentButton(buttonslist[nextStepIndex], buttonslist);
        handleNextButton(buttonslist[nextStepIndex]);
        sendBi('upperMenu', { 'buttonName': 'next' });
    });
}

const handleNextButton = (currStep) => {
    if (currStep === 'testAndSendButton') {
        Comp.nextStepButton.disable();
        Comp.sendStepButton.show();
        if (!Comp.sendStepButton.enabled) {
            Comp.hoverZoneSendTooltip.expand();
        } else {
            Comp.hoverZoneSendTooltip.collapse();
        }
    } else {
        Comp.nextStepButton.enable();
        Comp.sendStepButton.hide();
        Comp.hoverZoneSendTooltip.collapse();
    }
}

const getNextStepIndex = () => {
    const currentState = Comp.stepsOfCreationMultistateBox.currentState.id;
    for (let i = 0; i < constants.CommunicationStatesByOrder.length - 1; i++) {
        if (constants.CommunicationStatesByOrder[i] === currentState) {
            return i + 1
        }
    }
}