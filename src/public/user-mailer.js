import wixWindow from 'wix-window';
import * as TargetAudience from 'backend/target-audience-handler-wrapper.jsw';
import { Email } from './Email.js'
import { getUuidByEmail } from 'backend/data-methods-wrapper.jsw';
import { getTokenset } from './login.js';
import { state } from 'public/Pages/Communication/state-management.js';
import { DynamicFieldsOptions, TemplatesTypes } from 'public/consts.js';
import { getMustHaveFieldsOfCommunication } from 'public/Pages/helpers.js';
import { getAudienceDetails } from 'public/audience-handler.js';
import { toJS } from 'mobx';

export async function sendEmails(communicationn) {
    const communication = state.communication
    try {
        const userJWT = await getUserJWTToken();
        const allApprovedUsers = await reciveAllApprovedUsers(communication);
        state.setSentToCounter(allApprovedUsers.length);

        const arrayOfEmails = allApprovedUsers.map((user) => {
            let { title, emailContent, subjectLine, previewText, fullName, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);
            ({ title, emailContent, subjectLine, previewText } = evaluateDynamicVariabels(user, title, emailContent, subjectLine, previewText));
            adjustTemplateType(title);

            const email = new Email({
                templateName: communication.template.type,
                senderName,
                replyTo: replyToAddress,
                subjectLine,
                previewText,
                title,
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
            wixWindow.openLightbox('Setup & Publish – Sent Communication ');
        }
        return res
    } catch (error) {
        return Promise.reject('public/user-mailer.js sendEmails failed -origin error- ' + error)
    }
}

export const sendTestEmail = async (emailAddress, communication) => {
    try {
        const uuid = await getUuidByEmail(emailAddress);
        const userJWT = await getUserJWTToken();
        let { title, emailContent, subjectLine, fullName, previewText, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);
        adjustTemplateType(title);

        const email = new Email({
            templateName: communication.template.type,
            senderName,
            replyTo: replyToAddress,
            subjectLine,
            previewText,
            title,
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
        wixWindow.openLightbox('Setup & Publish - Error sending');
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

const evaluateDynamicVariabels = (user, emailTitle, emailContent, subjectLine, previewText) => {
    const strings = [emailTitle, emailContent, subjectLine, previewText]
    const evaluetedStrings = strings.map(string => {
        string = string.replace(new RegExp('{' + DynamicFieldsOptions.BusinessName + '}', "g"), user.site_display_name || state.communication.dynamicVaribels.businessName);
        string = string.replace(new RegExp('{' + DynamicFieldsOptions.UserWebsiteURL + '}', "g"), user.url || state.communication.dynamicVaribels.userWebsiteUrl);
        return string;
    });
    return { title: evaluetedStrings[0], emailContent: evaluetedStrings[1], subjectLine: evaluetedStrings[2], previewText: evaluetedStrings[3] }
}

const adjustTemplateType = (emailTitle) => {
    if (emailTitle.includes(DynamicFieldsOptions.UserFirstName)) {
        state.setTemplateType(TemplatesTypes.UserNameTemaplate)
    } else {
        state.setTemplateType(TemplatesTypes.DefaultTempalte)
    }
}

const getUserJWTToken = async () => {
    const tokenset = await getTokenset();
    const userJWT = tokenset.access_token;
    return userJWT;
}