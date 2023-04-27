import {autorun, toJS} from 'mobx';
import {targetAudienceState} from 'public/Pages/Communication/Target-Audience/target-audience.js';
import {state} from 'public/Pages/Communication/state-management.js';
import {reciveLatestApprovedUsers} from 'public/Pages/Communication/Target-Audience/uuids-repeater-handler.js';
import {disbaleCurrentButton} from 'public/Pages/helpers.js';
import {AllAudienceRepeaterButtons, FileNameLength} from 'public/consts.js';

export const initAudienceInformationBarActions = () => {
    setInfoBarButtonsOnClickActions();
}

export const initAudienceInformationBarData = () => {
    setInfoBarButtonsLabels();
}

let debounceTimer;

const setInfoBarButtonsOnClickActions = () => {
    $w('#approvedUsersButton').onClick(async () => {
        // $w('#approvedUsersButton').disable();
        await $w('#usersUuidsMultiState').changeState('ApprovedUsersState');

        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = undefined;
        }

        debounceTimer = setTimeout(() => {
            reciveLatestApprovedUsers();
        }, 500)

        // $w('#usersUuidsMultiState').changeState('ApprovedUsersState');
        disbaleCurrentButton('approvedUsersButton', AllAudienceRepeaterButtons);
    })

    $w('#needApprovalButton').onClick(async () => {
        await $w('#usersUuidsMultiState').changeState('needApprovalUsersState');
        disbaleCurrentButton('needApprovalButton', AllAudienceRepeaterButtons);

    })

    $w('#rejectedUsersButton').onClick(async () => {
        await $w('#usersUuidsMultiState').changeState('rejectedUserState');
        disbaleCurrentButton('rejectedUsersButton', AllAudienceRepeaterButtons);
    })
}

const setInfoBarButtonsLabels = () => {
    autorun(() => {
        let fileName = state?.communication?.targetAudienceCsvFileName || $w('#csvFileNameText').value || '';
        if (fileName.length > FileNameLength) {
            fileName = fileName.slice(0, filenameLength);
            +'...'
        }
        $w('#csvFileNameText').text = fileName;
        // $w('#csvFileNameText').text = `${state?.communication?.targetAudienceCsvFileName || $w('#csvFileNameText').value}`;
    })
    autorun(() => $w('#approvedCounterText').text = `${targetAudienceState?.approvedCounter || '0'}`);
    autorun(() => $w('#approvedPrecentageText').text = `${(targetAudienceState?.approvedPercenatge || '0') + '%'}`);
    autorun(() => {
        $w('#needAprrovalCounterText').text = `${targetAudienceState.needApprovalCounter || '0'}`
    });
    autorun(() => $w('#needApprovalPrecentageText').text = `${(targetAudienceState?.needApprovalPercenatge || '0') + '%'}`);

    autorun(() => $w('#rejectedCounterText').text = `${targetAudienceState?.rejectedCounter || '0'}`);
    autorun(() => $w('#rejectedPrecentageText').text = `${(targetAudienceState?.rejectedPercenatge || '0') + '%'}`);

    autorun(() => $w('#totalUsersCounterText').text = `${targetAudienceState?.totalCounter || '0'}`);

    autorun(() => targetAudienceState?.needApprovalCounter > 0 ? $w('#notAllUsersApprovedWarning').show() : $w('#notAllUsersApprovedWarning').hide());
}