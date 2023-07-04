import { autorun } from 'mobx';
import { state } from 'public/Pages/Communication/state-management.js'
import { getMustHaveFieldsOfCommunication } from 'public/Pages/helpers.js'

export const initValidations = () => {
    sendButtonValidations();
}

export const sendButtonValidations = () => {
    autorun(() => {
        if (allRequiredFieldsForSendToUsers(state.communication)) {
            $w('#sendStepButton').enable();
            $w('#hoverZoneSendTooltip').collapse();
        } else {
            const currentStep = $w('#stepsOfCreationMultistateBox').currentState.id;
            $w('#sendStepButton').disable();
            if (currentStep === 'testAndSend')
                $w('#hoverZoneSendTooltip').expand();
        }
    });
    autorun(() => {
        if (allRequiredFieldsForSendTestEmail(state.communication)) {
            $w('#sendTestButton').enable();
        } else {
            $w('#sendTestButton').disable();
        }

    });
}

const allRequiredFieldsForSendToUsers = (communication) => {
<<<<<<< HEAD
    const { title, emailContent, subjectLine, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);
    const response = title && emailContent && subjectLine && senderName && replyToAddress && communication.tested;
    //todo frizing send button
    return false;
=======
    const response = allRequiredFieldsForSendTestEmail(communication) && communication.tested;
    return response;
>>>>>>> main
}

const allRequiredFieldsForSendTestEmail = (communication) => {
    const { emailContent, subjectLine, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);
    const response = emailContent && subjectLine && senderName && replyToAddress;
    return response;
}