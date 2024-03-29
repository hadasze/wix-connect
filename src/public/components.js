const WithH = (string) => '#' + string;
// @ts-ignore
export const WC = (compID) => $w(WithH(compID));

export const CommunicationPage = {

    uploadCSVButton: WC('uploadCSVButton'),
    targetAudienceContent: WC('TargetAudienceContent'),
    csvDetailsAndActionsBox: WC('csvDetailsAndActionsBox'),
    replaceCsvFile: WC('replaceCsvFile'),
    replaceCSVTooltipBox: WC('replaceCSVTooltipBox'),
    downloadReportButton: WC('downloadReportButton'),
    downloadCSVTooltipBox: WC('downloadCSVTooltipBox'),
    autoSaveAnimation: WC('autoSaveAnimation'),
    sendStepButton: WC('sendStepButton'),
    nextStepButton: WC('nextStepButton'),
    addDetailsButton: WC('addDetailsButton'),
    targetAudienceButton: WC('targetAudienceButton'),
    setEmailheaderButton: WC('setEmailheaderButton'),
    previewOrSendTestEmailButton: WC('previewOrSendTestEmailButton'),
    createEmailButton: WC('createEmailButton'),
    testAndSendButton: WC('testAndSendButton'),
    hoverZoneSendTooltip: WC('hoverZoneSendTooltip'),
    sendButtonTooltipBox: WC('sendButtonTooltipBox'),
    headerEditMode: WC('HeaderEditMode'), //ToDo: change to lower case
    stepsOfCreationMultistateBox: WC('stepsOfCreationMultistateBox'),
    backToDashboardButton: WC('backToDashboardButton'),


    States: {
        TargetAudienceContentLoading: 'TargetAudienceContentLoading',
        TargetAudienceContentUpload: 'TargetAudienceContentUpload',
        AddDetailsState: 'AddDetailsState',
        TargetAudienceState: 'TargetAudienceState',
        SetEmailHeaderState: 'SetEmailHeaderState',
        TestAndSendState: 'TestAndSendState',
        CreateEmailState: 'CreateEmailState'
    },

}

export const CommunicationDashboardPage = {
    seeMoreTemplateActionsButton: WC('seeMoreTemplateActionsButton'),
    templateActionsBox: WC('templateActionsBox'),
    templatesItemInfoBox: WC('templatesItemInfoBox'),
    myTemplateItemBox: WC('myTemplateItemBox'),
    deleteTemplateButton: WC('deleteTemplateButton'),
    duplicateTemplateButton: WC('duplicateTemplateButton'),
    editTempalteButton: WC('editTempalteButton'),
    myTemplatesRepeater: WC('myTemplatesRepeater'),
    myCommunicationsButton: WC('myCommunicationsButton'),
    myCommunicationsRepeater: WC('myCommunicationsRepeater'),
    dashboardMultiState: WC('dashboardMultiState'),
    myCommunicationItemBox: WC('myCommunicationItemBox'),
    createCommunicationStateButton: WC('createCommunicationStateButton'),
    communicationClickbaleArea: WC('communicationClickbaleArea'),
    seeMoreActionsButton: WC('seeMoreActionsButton'),
    editCommunicationButton: WC('editCommunicationButton'),
    reuseCommunicationButton: WC('reuseCommunicationButton'),
    saveAsTempalteButton: WC('saveAsTempalteButton'),
    archiveCommunicationButton: WC('archiveCommunicationButton'),
    uarchiveCommunicationButton: WC('uarchiveCommunicationButton'),
    deleteCommunicationButton: WC('deleteCommunicationButton'),
    allButton: WC('allButton'),
    sentButton: WC('sentButton'),
    draftsButton: WC('draftsButton'),
    archiveButton: WC('archiveButton'),
    myCommunicationsButtonBarSeperator: WC('myCommunicationsButtonBarSeperator'),
    myTemplatesButton: WC('myTemplatesButton'),
    createCommunicationButton: WC('createCommunicationButton'),
    needHelpButton: WC('needHelpButton'),

    States: {
        myCommunicationsState: 'myCommunicationsState',
        emptyState: 'emptyState',
        myTemplatesState: 'myTemplatesState'
    },

    communicationActionsbox: ($i) => $i(WithH('communicationActionsbox')),
}

export const SendTestEmail = {
    sendBtn: WC('sendBtn'),
    cancelBtn: WC('cancelBtn'),
    sendingLoadingBox: WC('sendingLoadingBox'),
    testEmailsInput: WC('testEmailsInput'),
    emailIsNotValidBox: WC('emailIsNotValidBox'),
    testEmail: WC('testEmail'),
    sendMultiStateBox: WC('sendMultiStateBox'),
    tryAgainButton: WC('tryAgainButton'),
    errorMsgText: WC('errorMsgText'),
    gotItButton: WC('gotItButton'),

    States: {
        Send: 'Send',
        Error: 'Error',
        Success: 'Success'
    }

}

export const SendCommunication = {

    sendCommunicationTitleText: WC('sendCommunicationTitleText'),
    sendBtn: WC('sendBtn'),
    cancelBtn: WC('cancelBtn'),
    sendMultiStateBox: WC('sendMultiStateBox'),
    closeButton: WC('closeButton'),
    gotItErrorButton: WC('gotItErrorButton'),
    errorMsgText: WC('errorMsgText'),
    sendingLoadingBox: WC('sendingLoadingBox'),

    States: {
        Send: 'Send',
        Error: 'Error',
        Success: 'Success'
    }
}

export const ContactedUserDetailsSidebar = {
    contactedUserUUIDText: WC('contactedUserUUIDText'),
    contactedUserSiteNameText: WC('contactedUserSiteNameText'),
    contactedUserSiteURLText: WC('contactedUserSiteURLText'),
    contactedUserEmployeeEmailText: WC('contactedUserEmployeeEmailText'),
    dateOfLastContactedText: WC('dateOfLastContactedText')
}

export const Banner = {
    msgText: WC('msgText'),
}