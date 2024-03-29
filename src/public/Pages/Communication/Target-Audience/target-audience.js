import { observable, configure } from 'mobx';
import { initCSVFileActions } from './csv-file-handler.js'
import { initTargetAudienceRepeatersData, initTargetAudienceRepeatersActions, initRepeatersActions, initRejectedStateActions } from './uuids-repeater-handler';
import { initAudienceInformationBarActions, initAudienceInformationBarData } from './information-bar-handler.js'

configure({
    useProxies: "never"
})

export const initTargetAudienceActions = () => {
    initCSVFileActions();
    initAudienceInformationBarActions();
    initTargetAudienceRepeatersActions();
    initRepeatersActions();
    initRejectedStateActions();
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