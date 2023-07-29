// @ts-ignore
import wixWindow from 'wix-window';
import { isObservableArray, toJS } from 'mobx';

import { sendBi } from '../../BI/biModule.js';
import { SendCommunication as Comp } from '../../components.js';
import { getUserJWTToken, getOwnerUUID } from '../../_utils.js';
import { Email } from '../../Email.js'
import { getMustHaveFieldsOfCommunication } from '../helpers.js';
import { getAudienceDetails } from '../../audience-handler.js';

import * as Fedops from '../../wix-fedops-api.js';
import * as constants from '../../consts.js';

// @ts-ignore
import * as UserMailer from 'backend/user-mailer-api-wrapper.jsw';


const { state, approvedCounter } = wixWindow.lightbox.getContext();


console.log('send-communication: ', { state, approvedCounter });

export function setEvents() {

    Comp.sendBtn.onClick(async (event) => {
        disable();
        sendBi('sendCommunication', { 'campaignId': state.communication._id, 'button_name': 'send' });
        Fedops.interactionStarted(Fedops.events.sendEmail);
        await sendEmails();
    })

    Comp.cancelBtn.onClick((event) => {
        sendBi('sendCommunication', { 'campaignId': state.communication._id, 'button_name': 'cancel' });
        wixWindow.lightbox.close({ buttonName: constants.Text.CANCEL });
    })
}

export function bindData() {
    Comp.sendCommunicationTitleText.text = constants.Text.SEND_POPUP_TITLE(approvedCounter);
    +approvedCounter == 0 ? Comp.sendBtn.disable() : Comp.sendBtn.enable();
    if (+approvedCounter == 0) {
        Comp.sendBtn.disable();
    } else {
        Comp.sendBtn.enable();
    }
}

function disable() {
    Comp.cancelBtn.disable();
    Comp.sendBtn.disable();
    Comp.sendingLoadingBox.expand();
}

async function onSuccess() {
    Fedops.interactionEnded(Fedops.events.sendEmail);
    await Comp.sendMultiStateBox.changeState(Comp.States.Success);
}

async function onError(error) {
    console.error('public/user-mailer.js sendEmails failed -origin error- ', error + ' state: ', state);
    Comp.errorMsgText.text = constants.SendCommunicationError;
    await Comp.sendMultiStateBox.changeState(Comp.States.Error);
}

async function sendEmails() {
    console.log('sendEmails state: ', state);
    try {
        const [userJWT, allApprovedUsers] = await Promise.all([getUserJWTToken(), reciveAllApprovedUsers()]);
        console.log({ allApprovedUsers });
        state.setTemplateType(constants.TemplatesTypes.DefaultTempalte);
        const arrayOfEmails = allApprovedUsers.map((user) => {
            const email = buildEmail(user);
            return { userId: user.uuid, msid: user.msid, body: email.createBody() };
        });
        console.log({ arrayOfEmails });
        const ownerUUID = getOwnerUUID();
        console.log({ ownerUUID });
        const res = await UserMailer.sendEmailToWixUsers(arrayOfEmails, userJWT, false, ownerUUID);
        console.log('sendEmails res:', res);

        onSuccess();
    } catch (error) {
        onError(error);
    }
}

function buildEmail(user) {
    let { emailContent, subjectLine, previewText, fullName, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(state.communication);
    ({ emailContent, subjectLine, previewText } = evaluateDynamicVariabels(state, user, emailContent, subjectLine, previewText));
    const email = new Email({
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
    return email;
}

//ToDo: rewrite as bulletproof
function evaluateDynamicVariabels(state, user, emailContent, subjectLine, previewText) {
    try {
        const strings = [emailContent, subjectLine, previewText];
        const evaluetedStrings = strings.map(string => {
            if (!string) return;
            string = string.replace(new RegExp('{' + constants.DynamicFieldsOptions.BusinessName + '}', "g"), user.site_display_name || state.communication.dynamicVaribels.businessName);
            string = string.replace(new RegExp('{' + constants.DynamicFieldsOptions.UserWebsiteURL + '}', "g"), user.url || state.communication.dynamicVaribels.userWebsiteUrl);
            return string;
        });
        return { emailContent: evaluetedStrings[0], subjectLine: evaluetedStrings[1], previewText: evaluetedStrings[2] }
    } catch (error) {
        throw new Error('public -> user-mailer.js -> evaluateDynamicVariabels failed - origin error - ' + error);
    }
}


async function reciveAllApprovedUsers() {
    const uuidsAndMsidsList = typeof state.communication.targetAudience.slice === 'function' ? (Object.values(state.communication.targetAudience.slice())) : (Object.values(toJS(state.communication.targetAudience)));
    const audienceData = await getAudienceDetails(uuidsAndMsidsList);

    if (audienceData) {
        const manuallyApproveArray = typeof state.communication.manuallyApprovedUsers.slice === 'function' ? (Object.values(state.communication.manuallyApprovedUsers.slice())) : (Object.values(toJS(state.communication.manuallyApprovedUsers)));
        const allApprovedUsers = (audienceData.approved).concat(manuallyApproveArray);
        return allApprovedUsers;
    }
}
