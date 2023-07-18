
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