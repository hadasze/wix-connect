// @ts-ignore
import wixWindow from 'wix-window';

import { Email } from '../../Email.js'
import { sendBi } from '../../BI/biModule.js';
import { SendTestEmail as Comp } from '../../components.js';
import { getUserJWTToken } from '../../_utils.js';
import { getMustHaveFieldsOfCommunication } from '../helpers.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';

// @ts-ignore
import { getUuidByEmail } from 'backend/data-methods-wrapper.jsw';
// @ts-ignore
import * as UserMailer from 'backend/user-mailer-api-wrapper.jsw';

const state = wixWindow.lightbox.getContext();
const communication = state.communication;

export function setEvents() {
    const isTestEmailsInputValid = () => Comp.testEmailsInput.valid;

    Comp.sendBtn.onClick((event) => {
        sendBi('testEmail', { 'campaignId': communication._id, 'button_name': 'send' });
        disable();

        if (isTestEmailsInputValid()) {
            onValid();
        } else {
            onNotValid();
        }
    })

    Comp.cancelBtn.onClick((event) => {
        sendBi('testEmail', { 'campaignId': communication._id, 'button_name': 'cancel' });
        wixWindow.lightbox.close();
    })

    Comp.testEmailsInput.onInput((event) => {
        enableSendBtn();
    });

}

function enableSendBtn() {
    Comp.testEmailsInput.updateValidityIndication();
    Comp.testEmailsInput.value.length > 0 ? Comp.sendBtn.enable() : Comp.sendBtn.disable();
}

function disable() {
    Comp.sendBtn.disable();
    Comp.cancelBtn.disable();
    Comp.sendingLoadingBox.expand();
}

function enable() {
    enableSendBtn();
    Comp.cancelBtn.enable();
    Comp.sendingLoadingBox.collapse();
}

function onValid() {
    Comp.emailIsNotValidBox.hide();
    const email = Comp.testEmailsInput.value;


    sendTestEmail(email);
}

function onNotValid() {
    Comp.emailIsNotValidBox.show();
    enable();
}

async function sendTestEmail(emailAddress) {

    Fedops.interactionStarted(Fedops.events.sendTestEmail);

    try {
        state.setTemplateType(constants.TemplatesTypes.DefaultTempalte);
        const [userJWT, uuid] = await Promise.all([getUserJWTToken(), getUuidByEmail(emailAddress)]);
        const emailObj = buildEmailObj();
        const arrayOfEmail = [{ userId: uuid, body: emailObj.createBody() }];
        const isTestEmail = true;
        const results = await UserMailer.sendEmailToWixUsers(arrayOfEmail, userJWT, isTestEmail);
        await onSuccess(results);

    } catch (error) {
        await onError(error);
    }
}

function buildEmailObj() {

    const { emailContent, subjectLine, fullName, previewText, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);

    const emailObj = new Email({
        templateName: state.communication.template.type,
        senderName,
        replyTo: replyToAddress,
        subjectLine,
        previewText,
        emailContent: emailContent,
        emailcontent2: finalGreeting || '',
        firstLastName: fullName || '',
        positionTitle: positionTitle || '',
        communicationId: state.communication._id
    });

    return emailObj;
}

async function onSuccess(results) {
    console.log('sendTestEmail results:', results);
    state.setIsTested(true);
    Fedops.interactionEnded(Fedops.events.sendTestEmail);
    await Comp.sendMultiStateBox.changeState(Comp.States.Success);
}


async function onError(error) {
    console.error('public/user-mailer.js sendTestEmail failed -origin error- ' + error);
    Comp.errorMsgText.text = error.message;
    await Comp.sendMultiStateBox.changeState(Comp.States.Error);
    enable();
}