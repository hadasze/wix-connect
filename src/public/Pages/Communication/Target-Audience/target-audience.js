import { observable, configure } from 'mobx';
import { initCSVFileActions } from 'public/Pages/Communication/Target-Audience/csv-file-handler.js'
import { initTargetAudienceRepeatersData, initTargetAudienceRepeatersActions } from 'public/Pages/Communication/Target-Audience/uuids-repeater-handler';
import { initAudienceInformationBarActions, initAudienceInformationBarData } from 'public/Pages/Communication/Target-Audience/information-bar-handler.js'

configure({
    useProxies: "never"
})

export const initTargetAudienceActions = () => {
    initCSVFileActions();
    initAudienceInformationBarActions();
    initTargetAudienceRepeatersActions();
}
export const initTargetAudienceData = () => {
    initTargetAudienceRepeatersData();
    initAudienceInformationBarData();
}

export const targetAudienceState = observable({
    approvedCounter: null,
    needApprovalCounter: null,
    rejectedCounter: null,
    totalCounter: null,
    approvedPercenatge: null,
    needApprovalPercenatge: null,
    rejectedPercenatge: null,

    setApprovalCounter(counter) {
        targetAudienceState.approvedCounter = counter;
        targetAudienceState.approvedPercenatge = calculatePercentage(counter);
    },
    setNeedApprovalCounter(counter) {
        targetAudienceState.needApprovalCounter = counter;
        targetAudienceState.needApprovalPercenatge = calculatePercentage(counter);
    },
    setRejectedCounter(counter) {
        targetAudienceState.rejectedCounter = counter;
        targetAudienceState.rejectedPercenatge = calculatePercentage(counter);
    },
    setTotalCounter(counter) {
        targetAudienceState.totalCounter = counter;
    },
});

const calculatePercentage = (partialValue) => {
    return Math.round((100 * partialValue) / targetAudienceState.totalCounter);
}