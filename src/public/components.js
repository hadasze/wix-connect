
// @ts-ignore
export const WC = (compID) => $w('#' + compID);

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
    }
    // teamBtn: ($i) => $i('#teamBtn'),
}

export const CommunicationDashboardPage = {

    myCommunicationsRepeater: WC('myCommunicationsRepeater'),
    dashboardMultiState: WC('dashboardMultiState'),
    myCommunicationItemBox: WC('myCommunicationItemBox'),
    createCommunicationStateButton: WC('createCommunicationStateButton'),
    
    States: {
        myCommunicationsState: 'myCommunicationsState',
        emptyState: 'emptyState'
    }

}