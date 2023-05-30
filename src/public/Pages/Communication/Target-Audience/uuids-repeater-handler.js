import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import {autorun, toJS} from 'mobx';
import {state} from 'public/Pages/Communication/state-management.js';
import * as roles from 'public/Pages/Communication/Target-Audience/filters-roles.js';
import {getAudienceDetails} from 'public/audience-handler.js';
import {targetAudienceState} from 'public/Pages/Communication/Target-Audience/target-audience.js';
import {showToast} from 'public/Pages/Communication/Target-Audience/csv-file-handler.js';
import {disbaleCurrentButton, contains} from 'public/Pages/helpers.js';
import {AllAudienceRepeaterButtons, Text} from 'public/consts.js';
import {sendBi} from '../../../BI/biModule.js';
import * as Helpers from './helpers.js';

export const initTargetAudienceRepeatersActions = () => {
    initActions();
}

export const initTargetAudienceRepeatersData = () => {
    setTargetAudienceData();
}

const getLinkHTML = (url) => {
    return "<a  href=" + url  +
        " class=\"font_8 wixui-rich-text__text\" target=\"_blank\">" + url + "</a>";
}

const setTargetAudienceData = () => {
    $w('#approvedRepeater').onItemReady(($item, itemData, index) => {
        $item('#approvedUuidButton').label = itemData.uuid || '';
        $item('#approvedUuidTooltipText').text = itemData.uuid || '';
        $item('#approvedUserNameText').text = itemData.site_display_name || '';
        $item('#approvedSiteUrlText').html = getLinkHTML(itemData.url || '');
        roles.setUuidProperties(itemData, $item, 'Approved');
    });

    $w('#needApprovalReapter').onItemReady(($item, itemData, index) => {
        $item('#uuidButton').label = itemData.uuid || '';
        $item('#needApprovalUuidTooltipText').text = itemData.uuid || '';
        $item('#userNameText').text = itemData.site_display_name || '';
        $item('#needApprovalSiteUrlText').html = getLinkHTML(itemData.url || '');
        $item("#approveToggleSwitch").checked = false;
        Helpers.indicateApprovedToggleShouldBeChecked(itemData, $item);
        roles.setUuidProperties(itemData, $item, 'NeedApprove');
    });

    $w('#rejectedRepeater').onItemReady(($item, itemData, index) => {
        $item('#rejectedUuidButton').label = itemData.uuid || '';
        $item('#rejectedUuidTooltipText').text = itemData.uuid || '';
        $item('#rejectedUserNameText').text = itemData.site_display_name || '';
        $item('#rejectedSiteUrlText').html = getLinkHTML(itemData.url || '');
        roles.setUuidProperties(itemData, $item, 'Rejected');
    });

    autorun(async () => {
        if (state.communication?.targetAudience) {
            await $w('#TargetAudienceContent').changeState('TargetAudienceContentLoading');
            await setAllRepeatersAudienceData();
            await $w('#TargetAudienceContent').changeState('TargetAudienceContentLoaded') && $w('#csvDetailsAndActionsBox').show();
            $w('#usersUuidsMultiState').changeState('ApprovedUsersState');
            disbaleCurrentButton('approvedUsersButton', AllAudienceRepeaterButtons);
        }
    })
}

const setAllRepeatersAudienceData = async () => {
    //To remove once we have paginator
    $w('#Pagination').hide();
    try {
        const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)));
        const audienceData = await getAudienceDetails(uuidsAndMsidsList);
        if (audienceData) {
            const totalNumOfAudience = Helpers.calcTotalAudienceNum(audienceData);
            targetAudienceState.setTotalCounter(totalNumOfAudience);
            const allApprovedUsers = (audienceData.approved).concat((Object.values(state.communication.manuallyApprovedUsers)));

            setApprovedRepeater(allApprovedUsers)
            setNeedApprovaldRepeater(audienceData.needAprroval);
            setRejectedRepeater(audienceData.rejected);
            handleNotValidAudience(totalNumOfAudience, uuidsAndMsidsList.length);
        }

    } catch (error) {
        console.error('setAllRepeatersAudienceData error, original error: ' + error);
    }
}

export const reciveLatestApprovedUsers = async () => {
    const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)))
    const audienceData = await getAudienceDetails(uuidsAndMsidsList);
    if (audienceData) {
        const manuallyApproveArray = (Object.values(toJS(state.communication.manuallyApprovedUsers)))
        state.setManuallyApprovedUsers(manuallyApproveArray)
        const allApprovedUsers = (audienceData.approved).concat(manuallyApproveArray);
        setApprovedRepeater(allApprovedUsers);
        targetAudienceState.setNeedApprovalCounter(audienceData.needAprroval.length - manuallyApproveArray.length);
    }
}

// const setApprovedRepeaterNew = (data) => {
//     $w('#approvedRepeater').data = [];
//     let curr = 0;
//     const table = {};

//     $w('#loadMoreApprovalButton').onClick((event) => {
//         
//         curr++;
//         const newData = [...$w('#approvedRepeater').data, ...table[curr]];
//         $w('#approvedRepeater').data = newData;
//     })
//     // curr++;

//     // on click load t[curr]
//     // const newData = [...$w('#approvedRepeater').data, ...t[curr]];
//     //$w('#approvedRepeater').data = newData;

//     for (let i = 0; i < data.length; i += 10) {
//         const chunk = data.slice(i, i + 10);
//         table[i] = chunk;

//         //     setTimeout(() => {
//         //         const newData = [...$w('#approvedRepeater').data, ...chunk];

//         //         $w('#approvedRepeater').data = newData;

//         //     }, i * 100);
//     }
//     $w('#approvedRepeater').data = table[curr];
//     targetAudienceState.setApprovalCounter(data.length)
// }

const setApprovedRepeater = (data) => {
    $w('#approvedRepeater').data = [];
    for (let i = 0; i < data.length; i += 10) {
        const chunk = data.slice(i, i + 10);
        setTimeout(() => {
            const newData = [...$w('#approvedRepeater').data, ...chunk];
            $w('#approvedRepeater').data = newData;
        }, i * 100);
    }
    targetAudienceState.setApprovalCounter(data.length)
}

const setNeedApprovaldRepeater = (data) => {
    $w('#needApprovalReapter').data = [];
    for (let i = 0; i < data.length; i += 10) {
        const chunk = data.slice(i, i + 10);
        setTimeout(() => {
            const newData = [...$w('#needApprovalReapter').data, ...chunk];
            $w('#needApprovalReapter').data = newData;
        }, i * 100);
    }

    const numOfManuallyApproved = Object.values(state.communication.manuallyApprovedUsers).length;
    targetAudienceState.setNeedApprovalCounter(data.length - numOfManuallyApproved);
    autorun(() => $w('#numOfManuallyApprovedText').text = Text.NUM_OF_APPROVED(data.length - targetAudienceState.needApprovalCounter))
}

const setRejectedRepeater = (data) => {
    $w('#rejectedRepeater').data = [];
    for (let i = 0; i < data.length; i += 10) {
        const chunk = data.slice(i, i + 10);
        setTimeout(() => {
            const newData = [...$w('#rejectedRepeater').data, ...chunk];
            $w('#rejectedRepeater').data = newData;
        }, i * 100);
    }

    targetAudienceState.setRejectedCounter(data.length)
}
// let tmp;
const initActions = () => {
    autorun(() => $w('#requestApprovalButton').label = Text.REQUEST_APPROVAL_BTN(targetAudienceState.needApprovalCounter || ''));
    autorun(() => $w('#requestApprovalButton').label = Text.REQUEST_APPROVAL_BTN(targetAudienceState.needApprovalCounter || ''));

    $w('#requestApprovalButton').onClick(() => {
        sendBi('audienceClick', {'campaignId': state.communication._id, 'button_name': 'download_report'});
        wixWindow.openLightbox('Create Requests Pop Up', {
            uuidsAndMsidsList: (Object.values(toJS(state.communication.targetAudience))),
            needApprovalCounter: targetAudienceState.needApprovalCounter
        });
    })
    repeatedItemActions();
    setApproveToggleEvent();
}

const repeatedItemActions = () => {
    $w('#needApprovalCopyToClipBoardBtn').onClick((event) => {
        copyToClipBoard($w("#needApprovalReapter"), event)
    });
    $w('#approvedCopyToClipBoardBtn').onClick((event) => {
        copyToClipBoard($w("#approvedRepeater"), event)
    });
    $w('#rejectedCopyToClipBoardBtn').onClick((event) => {
        copyToClipBoard($w("#rejectedRepeater"), event)
    });
    $w(`#seeDetailsRejectedContacted`).onClick((event) => {
        openContactedLightBox($w("#rejectedRepeater"), event);
    })
    $w(`#seeDetailsApprovedTopUser`).onClick((event) => {
        openTopUserLightBox($w("#approvedRepeater"), event, 'approved');
    })
    $w(`#seeDetailsNeedApproveTopUser`).onClick((event) => {
        openTopUserLightBox($w("#needApprovalReapter"), event, 'needApproval');
    })
    $w(`#seeDetailsRejectedTopUser`).onClick((event) => {
        openTopUserLightBox($w("#rejectedRepeater"), event, 'rejected');
    })

    const copyToClipBoard = (repeater, event) => {
        const data = repeater.data;
        const clickedItemData = data.find(item => item._id === event.context.itemId);
        wixWindow.copyToClipboard(clickedItemData.uuid)
    }
    const clickOnUrl = (repeater, event) => {
        const data = repeater.data;
        const clickedItemData = data.find(item => item._id === event.context.itemId);
        const link = clickedItemData.url;
        const suffix = Math.random().toString(36).slice(2);
        const urlToOpen = `${link}&v=${suffix}`;
       
        $w('#linkOpener').setAttribute('link', urlToOpen)
        // return urlToOpen;
        // wixLocation.to(clickedItemData.url)
    }
    const openContactedLightBox = (repeater, event) => {
        const data = repeater.data;
        const clickedItemData = data.find(item => item._id === event.context.itemId);
        sendBi('openSideBar', {
            'campaignId': state.communication._id,
            'uuidChosen': clickedItemData.uuid,
            'cloumnName': 'contacted'
        })
        wixWindow.openLightbox("Contacted User Details Sidebar", {
            "user": clickedItemData,
            "communication": state.communication
        });
    }
    const openTopUserLightBox = (repeater, event, biCloumnName) => {
        const data = repeater.data;
        const clickedItemData = data.find(item => item._id === event.context.itemId);
        sendBi('openSideBar', {
            'campaignId': state.communication._id,
            'uuidChosen': clickedItemData.uuid,
            biCloumnName: biCloumnName
        })
        wixWindow.openLightbox("Top user", {"user": clickedItemData, "communication": state.communication});
    }
}

const setApproveToggleEvent = () => {
    $w('#approveAllButton').onClick(() => {
        if ($w('#approveAllButton').text === Text.APPROVE_ALL) {
            const needApprovalUsers = $w("#needApprovalReapter").data;
            const allManuallyApprovedUsers = (Object.values(toJS(state.communication.manuallyApprovedUsers)))
            needApprovalUsers.forEach((user) => {
                $w("#approveToggleSwitch").checked = true;
                if (!contains(allManuallyApprovedUsers, user))
                    state.addApprovedUser(user);
            })
            $w('#approveAllButton').text = Text.UNAPPROVE_ALL
            sendBi('approveToggle', {'campaignId': state.communication._id, 'button_name': 'approve_all'})
        } else {
            $w("#approveToggleSwitch").checked = false;
            state.resetApprovedUserList();
            $w('#approveAllButton').text = Text.APPROVE_ALL
            sendBi('approveToggle', {'campaignId': state.communication._id, 'button_name': 'unapprove_all'})
        }
    })

    $w("#approveToggleSwitch").onChange((event) => {
        const data = $w("#needApprovalReapter").data;
        const clickedItemData = data.find(item => item._id === event.context.itemId);
        const isChecked = event.target.checked;
        if (isChecked) {
            state.addApprovedUser(clickedItemData);
            sendBi('approveToggle', {
                'campaignId': state.communication._id,
                'uuid': clickedItemData.uuid,
                'button_name': 'toggle_on'
            })
        } else {
            state.removeApprovedUser(clickedItemData);
            sendBi('approveToggle', {
                'campaignId': state.communication._id,
                'uuid': clickedItemData.uuid,
                'button_name': 'toggle_off'
            })
        }
    });
}

const handleNotValidAudience = (uploadedCounter, allAudienceCounter) => {
    if (uploadedCounter < allAudienceCounter) {
        $w("#usersWereNotAddedErrorText").text = Text.USERS_WERE_NOT_UPLOADED(allAudienceCounter - uploadedCounter);
        showToast('usersWereNotAddedError', 10000);
    } else {
        $w("#uploadCSVSuccessText").text = Text.USERS_WERE_UPLOADED(uploadedCounter);
        showToast('uploadCSVSuccessToast', 3000);
    }
}