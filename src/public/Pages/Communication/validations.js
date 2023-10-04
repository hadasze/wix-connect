import { autorun } from 'mobx';
import { state } from './state-management.js'
import { getMustHaveFieldsOfCommunication } from '../helpers.js'
import { CommunicationPage as Comp } from '../../components.js';

export const initValidations = () => {
    sendButtonValidations();
}

export const sendButtonValidations = () => {
    autorun(() => {
        if (allRequiredFieldsForSendToUsers(state.communication)) {
            Comp.sendStepButton.enable();
            Comp.hoverZoneSendTooltip.collapse();
        } else {
            const currentStep = $w('#stepsOfCreationMultistateBox').currentState.id;
            Comp.sendStepButton.disable();
            if (currentStep === 'testAndSend')
                Comp.hoverZoneSendTooltip.expand();
        }
    });
}

const allRequiredFieldsForSendToUsers = (communication) => {
    const response = allRequiredFieldsForSendTestEmail(communication) && communication.tested;
    return response;
}

const allRequiredFieldsForSendTestEmail = (communication) => {
    const { emailContent, subjectLine, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);
    const response = emailContent && subjectLine && senderName && replyToAddress;
    return response;
}