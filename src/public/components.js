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

    States: {
        TargetAudienceContentLoading: 'TargetAudienceContentLoading',
        TargetAudienceContentUpload: 'TargetAudienceContentUpload',
    },

}

export const CommunicationDashboardPage = {

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

    States: {
        myCommunicationsState: 'myCommunicationsState',
        emptyState: 'emptyState',
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