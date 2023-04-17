
import { state } from 'public/Pages/Communication/state-management.js';

export const calcTotalAudienceNum = (audience) => {
    return Object.values(audience).reduce(
        (accumulator, list) => accumulator + list.length, 0)
}

export const indicateApprovedToggleShouldBeChecked = (itemData, $item) => {
    const manuallyApprovedUsers = Object.values(state.communication.manuallyApprovedUsers)
    for (const user in manuallyApprovedUsers) {
        if (manuallyApprovedUsers[user].uuid === itemData.uuid) {
            $item("#approveToggleSwitch").checked = true;
        }
    }
}

