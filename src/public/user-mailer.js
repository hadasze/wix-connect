import wixWindow from 'wix-window';

import * as TargetAudience from 'backend/target-audience-handler-wrapper.jsw';
import { getUuidByEmail } from 'backend/data-methods-wrapper.jsw';

import { toJS } from 'mobx';

import { Email } from './Email.js'
import { state } from './Pages/Communication/state-management.js';
import { DynamicFieldsOptions, TemplatesTypes } from './consts.js';
import { getMustHaveFieldsOfCommunication } from './Pages/helpers.js';
import { getAudienceDetails } from './audience-handler.js';
import { getUserJWTToken } from './_utils.js';


export async function sendEmails() {
    const communication = state.communication;
    try {
        const userJWT = await getUserJWTToken();
        const allApprovedUsers = await reciveAllApprovedUsers(communication);
        state.setTemplateType(TemplatesTypes.DefaultTempalte);
        const arrayOfEmails = allApprovedUsers.map((user) => {
            let { emailContent, subjectLine, previewText, fullName, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);

            ({ emailContent, subjectLine, previewText } = evaluateDynamicVariabels(user, emailContent, subjectLine, previewText));

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
            return { userId: user.uuid, body: email.createBody() };
        });
        const res = await TargetAudience.sendEmailToWixUsers(arrayOfEmails, userJWT, false);
        if (res) {
            state.setIsSent(true);
            state.setDraftStatus(false);
            state.setSentToCounter(allApprovedUsers.length);
            state.setFinalAudience(allApprovedUsers.map((item) => {
                const { uuid, msid } = item;
                return { uuid, msid };
            }));
            wixWindow.openLightbox('Setup & Publish – Sent Communication ');
        }
        return res
    } catch (error) {
        console.error('public/user-mailer.js sendEmails failed -origin error- ' + error);
        wixWindow.openLightbox('Setup & Publish - Error sending');
    }
}

export const sendTestEmail = async (emailAddress, communication) => {
    try {
        state.setTemplateType(TemplatesTypes.DefaultTempalte);
        const uuid = await getUuidByEmail(emailAddress);
        const userJWT = await getUserJWTToken();
        let { emailContent, subjectLine, fullName, previewText, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);
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
        const arrayOfEmail = [{ userId: uuid, body: email.createBody() }];
        const res = await TargetAudience.sendEmailToWixUsers(arrayOfEmail, userJWT, true);

        if (res) {
            state.setIsTested(true);

            wixWindow.openLightbox('Setup & Publish - Send Test Toast');
        }

    } catch (error) {
        wixWindow.openLightbox('Edit Email - Exit Warning Popup');
        return console.error('public/user-mailer.js sendTestEmail failed -origin error- ' + error)
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

const evaluateDynamicVariabels = (user, emailContent, subjectLine, previewText) => {
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
