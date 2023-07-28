// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import * as UserMailer from 'backend/user-mailer-api-wrapper.jsw';

import { toJS } from 'mobx';

import { Email } from './Email.js'
import { getMustHaveFieldsOfCommunication } from './Pages/helpers.js';
import { getAudienceDetails } from './audience-handler.js';
import { getUserJWTToken, redirectToMyCommunications } from './_utils.js';

import * as constants from './consts.js';
import * as Fedops from './wix-fedops-api.js';

export async function sendEmails(state) {
    console.log('sendEmails state: ', state);
    const communication = state.communication;
    try {

        const [userJWT, allApprovedUsers] = await Promise.all([getUserJWTToken(), reciveAllApprovedUsers(communication)]);
        console.log({ allApprovedUsers });
        state.setTemplateType(constants.TemplatesTypes.DefaultTempalte);
        const arrayOfEmails = allApprovedUsers.map((user) => {
            let { emailContent, subjectLine, previewText, fullName, positionTitle, finalGreeting, senderName, replyToAddress } = getMustHaveFieldsOfCommunication(communication);

            ({ emailContent, subjectLine, previewText } = evaluateDynamicVariabels(state, user, emailContent, subjectLine, previewText));
            console.log('sendEmails:', { emailContent, subjectLine, previewText });
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
        await wixWindow.openLightbox(constants.Lightboxs.sentCommunication);
        await redirectToMyCommunications();
    } catch (error) {
        console.error('public/user-mailer.js sendEmails failed -origin error- ' + error);
        await wixWindow.openLightbox(constants.Lightboxs.errorSending);
        // @ts-ignore
        $w('#sendStepButton').enable();
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
            string = string.replace(new RegExp('{' + constants.DynamicFieldsOptions.BusinessName + '}', "g"), user.site_display_name || state.communication.dynamicVaribels.businessName);
            string = string.replace(new RegExp('{' + constants.DynamicFieldsOptions.UserWebsiteURL + '}', "g"), user.url || state.communication.dynamicVaribels.userWebsiteUrl);
            return string;
        });
        return { emailContent: evaluetedStrings[0], subjectLine: evaluetedStrings[1], previewText: evaluetedStrings[2] }
    } catch (error) {
        throw new Error('public -> user-mailer.js -> evaluateDynamicVariabels failed - origin error - ' + error);
    }
}
