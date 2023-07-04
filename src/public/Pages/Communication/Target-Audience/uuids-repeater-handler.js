import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { autorun, toJS } from 'mobx';
import { state } from 'public/Pages/Communication/state-management.js';
import * as roles from 'public/Pages/Communication/Target-Audience/filters-roles.js';
import { getAudienceDetails } from 'public/audience-handler.js';
import { targetAudienceState } from 'public/Pages/Communication/Target-Audience/target-audience.js';
import { showToast } from 'public/Pages/Communication/Target-Audience/csv-file-handler.js';
import { disbaleCurrentButton, contains } from 'public/Pages/helpers.js';
import { AllAudienceRepeaterButtons, Text } from 'public/consts.js';
import { sendBi } from '../../../BI/biModule.js';
import * as Helpers from './helpers.js';
import { PagedRepeater, PagedRepeaterOptions, ButtonInfo } from '../../../paged-repeater';
import { create } from 'wix-fedops';

const fedopsLogger = create('wix-connect');
let approvedRepeater, needApprovalRepeater, rejectedRepeater;
let audienceData;
const repeaterOptions = new PagedRepeaterOptions(10);
const NUM_BUTTONS = 7;

export const initRejectedStateActions = () => {
    setTooltipActions();
}

export const initTargetAudienceRepeatersActions = () => {
    initActions();
}

export const initTargetAudienceRepeatersData = () => {
    setTargetAudienceData();
}

const setTooltipActions = () => {
    $w('#unqualifiedBox').onMouseIn((event) => {
        $w('#unqualifiedTooltip').show();
    })
}

const getLinkHTML = (url) => {
    return "<a  href=" + url +
        " class=\"font_8 wixui-rich-text__text\" target=\"_blank\">" + url + "</a>";
}

export const initRepeatersActions = () => {
    $w("#next").onClick((event) => {
        nextPage();
    });
    $w("#back").onClick((event) => {
        prevPage();
    });
    for (let i = 1; i < 8; i++) {
        let button = getPaginationButton(i);
        button.onClick((event) => {
            console.log({ event });
            if (event.target.label == '...') {
                return;
            } else {
                gotoPage(Number(event.target.label) - 1);
            }
        });
    }

    $w("#input15").onInput((event) => {
        filterData(
            $w('#searchCol').value,
            $w('#searchVal').value);
    });
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
            clearAllRepeatersAudienceData();
            await $w('#TargetAudienceContent').changeState('TargetAudienceContentLoading');
            await setAllRepeatersAudienceData();
            await $w('#TargetAudienceContent').changeState('TargetAudienceContentLoaded') && $w('#csvDetailsAndActionsBox').show();
            $w('#usersUuidsMultiState').changeState('ApprovedUsersState');
            disbaleCurrentButton('approvedUsersButton', AllAudienceRepeaterButtons);
        }
    })
}

function clearAllRepeatersAudienceData() {
    $w('#approvedRepeater').data = [];
    $w('#needApprovalReapter').data = [];
    $w('#rejectedRepeater').data = [];
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
<<<<<<< HEAD

            setApprovedRepeater(allApprovedUsers);
=======
            setApprovedRepeater(allApprovedUsers)
>>>>>>> main
            setNeedApprovaldRepeater(audienceData.needAprroval);
            setRejectedRepeater(audienceData.rejected);
            handleNotValidAudience(totalNumOfAudience, uuidsAndMsidsList.length);
        }

    } catch (error) {
        console.error('setAllRepeatersAudienceData error, original error: ' + error);
    }
}

const getAllData = async () => {
    console.log("GetAllData");
    try {
        const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)));
        const audienceData = await getAudienceDetails(uuidsAndMsidsList);
        // console.log("AudienceData : ", JSON.stringify(audienceData));
        return audienceData.approved;

    } catch (error) {
        throw new Error('Failed to fetch repeater data: ' + error);
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

<<<<<<< HEAD
// const setApprovedRepeaterNew = (data) => {
//     $w('#approvedRepeater').data = [];
//     let curr = 0;
//     const table = {};

//     $w('#loadMoreApprovalButton').onClick((event) => {
//         console.log({ curr, table });
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

function filter(row, value) {
    console.log('searching for: ', value);
    if (value == '') {
        return true;
    }
    console.log(JSON.stringify(row));
    for (const field of Object.values(row)) {
        console.log(JSON.stringify(field));
        if ((typeof field) == 'string' && field.includes(value)) {
            return true;
        }
    }
    return false;
}

const setApprovedRepeater = async (data) => {
    fedopsLogger.interactionStarted('set-approved-repeater');
    approvedRepeater =
        new PagedRepeater($w('#approvedRepeater'), getAllData, filter, null, null, repeaterOptions);
    await approvedRepeater.initRepeater();
    fedopsLogger.interactionEnded('set-approved-repeater');
    // const approvedState = approvedRepeater.getState();
    setPagination(approvedRepeater);

    targetAudienceState.setApprovalCounter(data.length)
=======
const setApprovedRepeater = (data) => {
    $w('#approvedRepeater').data = data;
    targetAudienceState.setApprovalCounter(data.length);
>>>>>>> main
}

function getPaginationButton(i) {
    return $w('#toggle' + (i).toString());
}

function getButtonByPage(page) {
    console.log("getByPage:", page)
    const pageStr = page.toString();
    for (let i = 1; i < 8; i++) {
        let button = getPaginationButton(i);
        if (button.label == pageStr) {
            return button;
        }
    }
    return null;
}

function setPagination() {
    
    for (let i = 1; i <= NUM_BUTTONS; i++) {
        let button = getPaginationButton(i);
        button.hide();
    }
    const buttonsInfo = approvedRepeater.setPaginator(NUM_BUTTONS);

    for (let i = 0; i < buttonsInfo.length; i++) {
        const buttonInfo = buttonsInfo[i];
        const button = getPaginationButton(i + 1);
        button.style.backgroundColor = "#ffffff";
        button.style.foregroundColor = "#000000";
        button.show();
        if (buttonInfo.state == ButtonInfo.RANGE) {
            button.label = '...';
        }
        else if (buttonInfo.state == ButtonInfo.SELECTED) {
            button.style.backgroundColor = "#166AEA";
        }
        else {
            button.label = buttonInfo.text;
        }
    }
    const state = approvedRepeater.getState();
    if (state.currPage == 0) {
        $w('#back').disable();
    } else {
        $w('#back').enable();
    }
    if (state.currPage == state.numPages - 1) {
        $w('#next').disable();
    } else {
        $w('#next').enable();
    }
}


function gotoPage(page) {
    console.log("Jumping to:", page);
    approvedRepeater.goto(page);
    setPagination();
}


export function nextPage() {
    console.log(`moving forward! - next page ${this.page + 1}`);
    approvedRepeater.next();
    setPagination();
}

export function prevPage() {
    console.log("Back off!");
    approvedRepeater.prev();
    setPagination();
}

export function filterData(column, value) {
    console.log("Looking for: ", value, " in: ", column);
    approvedRepeater.search(value.trim());
}

const setNeedApprovaldRepeater = (data) => {
    $w('#needApprovalReapter').data = data;
    const numOfManuallyApproved = Object.values(state.communication.manuallyApprovedUsers).length;
    targetAudienceState.setNeedApprovalCounter(data.length - numOfManuallyApproved);
    autorun(() => $w('#numOfManuallyApprovedText').text = Text.NUM_OF_APPROVED(data.length - targetAudienceState.needApprovalCounter))
}

const setRejectedRepeater = (data) => {
    $w('#rejectedRepeater').data = data;
    targetAudienceState.setRejectedCounter(data.length)
}

const initActions = () => {
    autorun(() => $w('#requestApprovalButton').label = Text.REQUEST_APPROVAL_BTN(targetAudienceState.needApprovalCounter || ''));
    autorun(() => $w('#requestApprovalButton').label = Text.REQUEST_APPROVAL_BTN(targetAudienceState.needApprovalCounter || ''));

    $w('#requestApprovalButton').onClick(() => {
        sendBi('audienceClick', { 'campaignId': state.communication._id, 'button_name': 'download_report' });
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
    $w('#needApprovalSiteUrlText').onClick((event) => {
        clickOnUrl($w("#needApprovalReapter"), event);
    });
    $w('#approvedCopyToClipBoardBtn').onClick((event) => {
        copyToClipBoard($w("#approvedRepeater"), event)
    });
    $w('#approvedSiteUrlText').onClick((event) => {
        clickOnUrl($w("#approvedRepeater"), event);
    });
    $w('#rejectedCopyToClipBoardBtn').onClick((event) => {
        copyToClipBoard($w("#rejectedRepeater"), event)
    });
    $w('#rejectedSiteUrlText').onClick((event) => {
        clickOnUrl($w("#rejectedRepeater"), event);
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
<<<<<<< HEAD
=======

>>>>>>> main
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
        wixWindow.openLightbox("Top user", { "user": clickedItemData, "communication": state.communication });
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
            sendBi('approveToggle', { 'campaignId': state.communication._id, 'button_name': 'approve_all' })
        } else {
            $w("#approveToggleSwitch").checked = false;
            state.resetApprovedUserList();
            $w('#approveAllButton').text = Text.APPROVE_ALL
            sendBi('approveToggle', { 'campaignId': state.communication._id, 'button_name': 'unapprove_all' })
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