// @ts-ignore
import wixWindow from 'wix-window';

import { observable, configure, toJS } from 'mobx';
import { clearAudiance } from '../../audience-handler.js';

let routerData = wixWindow.getRouterData();

configure({
    useProxies: "never"
})

export const state = observable({
    communication: routerData,
    createEmailAvailable: undefined,
    setCreateEmailAvailable(isAvailible) {
        state.createEmailAvailable = isAvailible;
    },
    setStatus(status) {
        state.communication.status = status;
    },
    setTargetAudienceCSV(csvURL) {
        state.communication.targetAudienceCsv = csvURL;
    },
    setTargetAudienceCSVFileName(fileName) {
        state.communication.targetAudienceCsvFileName = fileName;
    },
    setTargetAudience(audienceData) {
        state.communication.targetAudience = audienceData ? clearAudiance(audienceData) : audienceData;
    },
    setManuallyApprovedUsers(approvedUsers) {
        state.communication.manuallyApprovedUsers = approvedUsers;
    },
    setFinalAudience(approvedUsers) {
        state.communication.finalSentToAudience = approvedUsers;
    },
    addApprovedUser(user) {
        const manuallyApproveArray = (Object.values(toJS(state.communication.manuallyApprovedUsers)))
        manuallyApproveArray.push(user);
        state.setManuallyApprovedUsers(manuallyApproveArray)
    },
    removeApprovedUser(user) {
        const manuallyApproveArray = (Object.values(toJS(state.communication.manuallyApprovedUsers)))
        const updatedManuallyApproveArray = manuallyApproveArray.filter((currUser) => currUser.uuid !== user.uuid)
        state.setManuallyApprovedUsers(updatedManuallyApproveArray)
    },
    resetApprovedUserList() {
        state.setManuallyApprovedUsers([])
    },
    setTemplateType(type) {
        state.communication.template.type = type;
    },
    setCommunicationName(name) {
        state.communication.name = name;
    },
    setCommunicationDescription(description) {
        state.communication.description = description;
    },
    setTemplateImg(img) {
        state.communication.template.data.img = img;
    },

    setTemplateBody(text) {
        state.communication.template.data.body = text;
    },
    setFinalGreeting(value) {
        state.communication.signature.finalGreeting = value;
    },
    setSignatureFullName(value) {
        state.communication.signature.fullName = value;
    },
    setSignaturePositionTitle(value) {
        state.communication.signature.positionTitle = value;
    },
    setBusinessName(businessName) {
        state.communication.dynamicVaribels.businessName = businessName;
    },
    setUserFirstName(userFirstName) {
        state.communication.dynamicVaribels.userFirstName = userFirstName;
    },
    setUserWebsiteUrl(userWebsiteUrl) {
        state.communication.dynamicVaribels.userWebsiteUrl = userWebsiteUrl;
    },
    setSenderName(senderName) {
        state.communication.finalDetails.senderName = senderName;
    },
    setSubjectLine(subjectLine) {
        state.communication.finalDetails.subjectLine = subjectLine;
    },
    setPreviewText(text) {
        state.communication.finalDetails.previewText = text;
    },
    setAddressToReply(address) {
        state.communication.finalDetails.replyToAddress = address;
    },
    setIsTested(isTested) {
        state.communication.tested = isTested;
    },
    setIsSent(isSent) {
        state.communication.sent = isSent;
    },
    setDraftStatus(isDraft) {
        state.communication.draft = isDraft;
    },
    setSentToCounter(counter) {
        state.communication.sentToCounter = counter;
    }
});