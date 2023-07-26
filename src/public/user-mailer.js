// @ts-ignore
import wixWindow from 'wix-window';

import * as Fedops from './wix-fedops-api.js';

// @ts-ignore
import { getUuidByEmail } from 'backend/data-methods-wrapper.jsw';
// @ts-ignore
import * as UserMailer from 'backend/user-mailer-api-wrapper.jsw';



import { toJS } from 'mobx';

import { Email } from './Email.js'
// import { state } from './Pages/Communication/state-management.js';
import { DynamicFieldsOptions, TemplatesTypes } from './consts.js';
import { getMustHaveFieldsOfCommunication } from './Pages/helpers.js';
import { getAudienceDetails } from './audience-handler.js';
import { getUserJWTToken, redirectToMyCommunications } from './_utils.js';


export async function sendEmails(state) {
    console.log('sendEmails state: ', state);
    const communication = state.communication;
    try {

        const [userJWT, allApprovedUsers] = await Promise.all([getUserJWTToken(), reciveAllApprovedUsers(communication)]);
        console.log({ allApprovedUsers });
        state.setTemplateType(TemplatesTypes.DefaultTempalte);
        const arrayOfEmails = allApprovedUsers.map((user) => {
            let { emailContent, subjectLine, previewText, fullName, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);

            ({ emailContent, subjectLine, previewText } = evaluateDynamicVariabels(state, user, emailContent, subjectLine, previewText));

            const email = new Email({
                templateName: communication.template.type,
                senderName,
                replyTo: replyToAddress,
                subjectLine,
                previewText,
                emailContent: emailContent,
                emailcontent2: finalGreeting || '',
                firstLastName: fullName || '',
                positionTitle: positionTitle || '',
                communicationId: communication._id
            });
            return { userId: user.uuid, msid: user.msid, body: email.createBody() };
        });
        console.log({ arrayOfEmails });
        const res = await UserMailer.sendEmailToWixUsers(arrayOfEmails, userJWT, false);
        console.log('sendEmails res:', res);
        Fedops.interactionEnded(Fedops.events.sendEmail);
        await wixWindow.openLightbox('Setup & Publish – Sent Communication');
        await redirectToMyCommunications();
    } catch (error) {
        console.error('public/user-mailer.js sendEmails failed -origin error- ' + error);
        await wixWindow.openLightbox('Setup & Publish - Error sending');
        // @ts-ignore
        $w('#sendStepButton').enable();
    }
}

export const sendTestEmail = async (state, emailAddress) => {
    console.log('sendTestEmail', { state });
    try {
        state.setTemplateType(TemplatesTypes.DefaultTempalte);
        const [userJWT, uuid] = await Promise.all([getUserJWTToken(), getUuidByEmail(emailAddress)]);
        let { emailContent, subjectLine, fullName, previewText, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(state.communication);
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
        const arrayOfEmail = [{ userId: uuid, body: email.createBody() }];
        const res = await UserMailer.sendEmailToWixUsers(arrayOfEmail, userJWT, true);
        Fedops.interactionEnded(Fedops.events.sendTestEmail);
        console.log('sendTestEmail res:', res);

        state.setIsTested(true);

        wixWindow.openLightbox('Setup & Publish - Send Test Toast');

    } catch (error) {
        wixWindow.openLightbox('Edit Email - Exit Warning Popup');
        return console.error('public/user-mailer.js sendTestEmail failed -origin error- ' + error);
    }
}

export const reciveAllApprovedUsers = async (communication) => {
    const uuidsAndMsidsList = (Object.values(toJS(communication.targetAudience)))
    const audienceData = await getAudienceDetails(uuidsAndMsidsList);
    if (audienceData) {
        const manuallyApproveArray = (Object.values(toJS(communication.manuallyApprovedUsers)))
        const allApprovedUsers = (audienceData.approved).concat(manuallyApproveArray);
        return allApprovedUsers;
    }
}

const evaluateDynamicVariabels = (state, user, emailContent, subjectLine, previewText) => {
    try {
        const strings = [emailContent, subjectLine, previewText];
        const evaluetedStrings = strings.map(string => {
            if (!string) return;
            string = string.replace(new RegExp('{' + DynamicFieldsOptions.BusinessName + '}', "g"), user.site_display_name || state.communication.dynamicVaribels.businessName);
            string = string.replace(new RegExp('{' + DynamicFieldsOptions.UserWebsiteURL + '}', "g"), user.url || state.communication.dynamicVaribels.userWebsiteUrl);
            return string;
        });
        return { emailContent: evaluetedStrings[1], subjectLine: evaluetedStrings[2], previewText: evaluetedStrings[3] }
    } catch (error) {
        throw new Error('public -> user-mailer.js -> evaluateDynamicVariabels failed - origin error - ' + error);
    }
}
