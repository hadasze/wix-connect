import wixWindow from 'wix-window';

import { autorun, toJS } from 'mobx';

import { state } from '../state-management.js';
import { getAudienceDetails } from '../../../audience-handler.js';
import { targetAudienceState } from './target-audience.js';
import { showToast } from './csv-file-handler.js';
import { disbaleCurrentButton, contains } from '../../helpers.js';
import { sendBi } from '../../../BI/biModule.js';
import { PagedRepeater, PagedRepeaterOptions, ButtonInfo } from '../../../paged-repeater';

import * as roles from './filters-roles.js';
import * as Helpers from './helpers.js';
import * as Fedops from '../../../wix-fedops-api.js';
import * as constants from '../../../consts.js';

const repeaterOptions = new PagedRepeaterOptions(10);

const approvedRepeater = new PagedRepeater(filter, null, repeaterOptions);
const needApprovalRepeater = new PagedRepeater(filter, null, repeaterOptions);
const rejectedRepeater = new PagedRepeater(filter, null, repeaterOptions);
const NUM_BUTTONS = 7;

const stateToRepeaterMap = {
    'ApprovedUsersState': approvedRepeater,
    'rejectedUserState': rejectedRepeater,
    'needApprovalUsersState': needApprovalRepeater
}

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
        nextPage(getReapeater());
    });
    $w("#back").onClick((event) => {
        prevPage(getReapeater());
    });
    for (let i = 1; i < 8; i++) {
        let button = getPaginationButton(i);
        button.onClick((event) => {
            if (event.target.label == '...') {
                return;
            } else {
                gotoPage((Number(event.target.label) - 1), getReapeater());
            }
        });
    }

    $w("#input15").onInput((event) => {
        filterData(
            $w('#searchCol').value,
            $w('#searchVal').value, getReapeater());
    });

    $w('#usersUuidsMultiState').onChange(event => {
        let currentState = event.target.currentState.id;
        setPagination(stateToRepeaterMap[currentState]);
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
            // clearAllRepeatersAudienceData();
            await $w('#TargetAudienceContent').changeState('TargetAudienceContentLoading');
            await setAllRepeatersAudienceData();
            await $w('#TargetAudienceContent').changeState('TargetAudienceContentLoaded') && $w('#csvDetailsAndActionsBox').show();
            $w('#usersUuidsMultiState').changeState('ApprovedUsersState');
            disbaleCurrentButton('approvedUsersButton', constants.AllAudienceRepeaterButtons);
        }
    })
}

// function clearAllRepeatersAudienceData() {
//     $w('#approvedRepeater').data = [];
//     $w('#needApprovalReapter').data = [];
//     $w('#rejectedRepeater').data = [];
// }

const setAllRepeatersAudienceData = async () => {

    try {
        const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)));
        const audienceData = await getAudienceDetails(uuidsAndMsidsList);
        if (audienceData) {
            const totalNumOfAudience = Helpers.calcTotalAudienceNum(audienceData);
            targetAudienceState.setTotalCounter(totalNumOfAudience);
            const allApprovedUsers = (audienceData.approved).concat((Object.values(state.communication.manuallyApprovedUsers)));

            reciveLatestApprovedUsers(allApprovedUsers);
            setNeedApprovaldRepeater(audienceData.needAprroval);
            setRejectedRepeater(audienceData.rejected);
            handleNotValidAudience(totalNumOfAudience, uuidsAndMsidsList.length);
        }

    } catch (error) {
        console.error('setAllRepeatersAudienceData error, original error: ' + error);
    }
}

export const reciveLatestApprovedUsers = async (allApprovedUsers) => {

    let audienceData
    let manuallyApproveArray = [];

    if (!allApprovedUsers) {
        const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)))
        audienceData = await getAudienceDetails(uuidsAndMsidsList);
        if (audienceData) {
            manuallyApproveArray = (Object.values(toJS(state.communication.manuallyApprovedUsers)))
            state.setManuallyApprovedUsers(manuallyApproveArray)
            allApprovedUsers = (audienceData.approved).concat(manuallyApproveArray);
        }
    }

    if (allApprovedUsers) {
        //quick win to solve bug in viewr when the repeater isn't render
        setTimeout(() => {
            setApprovedRepeater(allApprovedUsers);
        }, 100);

    }
    if (audienceData) {
        targetAudienceState.setNeedApprovalCounter(audienceData.needAprroval.length - manuallyApproveArray.length);
    }
}

function filter(row, value) {
    if (value == '') {
        return true;
    }
    for (const field of Object.values(row)) {
        if ((typeof field) == 'string' && field.includes(value)) {
            return true;
        }
    }
    return false;
}

const setApprovedRepeater = (data) => {
    Fedops.interactionStarted(Fedops.events.setApprovedRepeater);
    approvedRepeater.setRepeater($w('#approvedRepeater'));
    approvedRepeater.setData(data);
    Fedops.interactionEnded(Fedops.events.setApprovedRepeater);

    setPagination(approvedRepeater);

    targetAudienceState.setApprovalCounter(data.length);

}

function getPaginationButton(i) {
    return $w('#toggle' + (i).toString());
}

function setPagination(repeater) {

    for (let i = 1; i <= NUM_BUTTONS; i++) {
        let button = getPaginationButton(i);
        button.hide();
    }
    const buttonsInfo = repeater.setPaginator(NUM_BUTTONS);

    for (let i = 0; i < buttonsInfo.length; i++) {
        const buttonInfo = buttonsInfo[i];
        const button = getPaginationButton(i + 1);
        button.style.backgroundColor = "#ffffff";
        button.style.foregroundColor = "#000000";
        button.show();
        button.label = buttonInfo.text;
        if (buttonInfo.state == ButtonInfo.RANGE) {
            button.label = '...';
        }
        if (buttonInfo.state == ButtonInfo.SELECTED) {
            button.style.backgroundColor = "#166AEA";
        }

    }
    const state = repeater.getState();
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

function gotoPage(page, repeater) {
    repeater.goto(page);
    setPagination(repeater);
}

export function nextPage(repeater) {
    repeater.next();
    setPagination(repeater);
}

export function prevPage(repeater) {
    repeater.prev();
    setPagination(repeater);
}

export function filterData(column, value, repeater) {
    repeater.search(value.trim());
}

const setNeedApprovaldRepeater = (data) => {
    needApprovalRepeater.setRepeater($w('#needApprovalReapter'));
    needApprovalRepeater.setData(data);
    setPagination(needApprovalRepeater);
    const numOfManuallyApproved = Object.values(state.communication.manuallyApprovedUsers).length;
    targetAudienceState.setNeedApprovalCounter(data.length - numOfManuallyApproved);
    autorun(() => $w('#numOfManuallyApprovedText').text = constants.Text.NUM_OF_APPROVED(data.length - targetAudienceState.needApprovalCounter))
}

const setRejectedRepeater = async (data) => {
    rejectedRepeater.setRepeater($w('#rejectedRepeater'));
    rejectedRepeater.setData(data);
    setPagination(rejectedRepeater);
    targetAudienceState.setRejectedCounter(data.length)
}

const initActions = () => {
    
    autorun(() => $w('#requestApprovalButton').label = constants.Text.REQUEST_APPROVAL_BTN(targetAudienceState.needApprovalCounter || ''));
    autorun(() => $w('#requestApprovalButton').label = constants.Text.REQUEST_APPROVAL_BTN(targetAudienceState.needApprovalCounter || ''));

    $w('#requestApprovalButton').onClick(() => {
        sendBi('audienceClick', { 'campaignId': state.communication._id, 'buttonName': 'request_approval' });
        wixWindow.openLightbox(constants.Lightboxs.createRequests, {
            uuidsAndMsidsList: (Object.values(toJS(state.communication.targetAudience))),
            needApprovalCounter: targetAudienceState.needApprovalCounter,
            campaignId: state.communication._id
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
        openTopUserLightBox($w("#approvedRepeater"), event);
    })
    $w(`#seeDetailsNeedApproveTopUser`).onClick((event) => {
        openTopUserLightBox($w("#needApprovalReapter"), event);
    })
    $w(`#seeDetailsRejectedTopUser`).onClick((event) => {
        openTopUserLightBox($w("#rejectedRepeater"), event);
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

        wixWindow.openLightbox(constants.Lightboxs.contactedUserDetailsSidebar, {
            "user": clickedItemData,
            "communication": state.communication
        });
    }

    const openTopUserLightBox = (repeater, event) => {
        const data = repeater.data;
        const clickedItemData = data.find(item => item._id === event.context.itemId);
        sendBi('openSideBar', {
            'campaignId': state.communication._id,
            'uuidChosen': clickedItemData.uuid,
            'cloumnName': 'topUser'
        })
        wixWindow.openLightbox(constants.Lightboxs.topUser, { "user": clickedItemData, "communication": state.communication });
    }
}

const setApproveToggleEvent = () => {
    $w('#approveAllButton').onClick(() => {
        if ($w('#approveAllButton').text === constants.Text.APPROVE_ALL) {
            const needApprovalUsers = needApprovalRepeater.allData;

            const allManuallyApprovedUsers = (Object.values(toJS(state.communication.manuallyApprovedUsers)));
            $w("#approveToggleSwitch").checked = true;
            needApprovalUsers.forEach((user) => {
                if (!contains(allManuallyApprovedUsers, user)) {
                    state.addApprovedUser(user);
                    sendBi('approveToggle', { 'campaignId': state.communication._id, 'uuidChosen': user.uuid, 'buttonName': 'approve_all' });
                }
            });
            $w('#approveAllButton').text = constants.Text.UNAPPROVE_ALL;

        } else {
            $w("#approveToggleSwitch").checked = false;
            const allManuallyApprovedUsers = (Object.values(toJS(state.communication.manuallyApprovedUsers)));
            allManuallyApprovedUsers.forEach(user => {
                console.log({ user });
                sendBi('approveToggle', { 'campaignId': state.communication._id, 'uuidChosen': user.uuid, 'buttonName': 'unapprove_all' });
            });
            state.resetApprovedUserList();
            $w('#approveAllButton').text = constants.Text.APPROVE_ALL

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
                'uuidChosen': clickedItemData.uuid,
                'buttonName': 'toggle_on'
            })
        } else {
            state.removeApprovedUser(clickedItemData);
            sendBi('approveToggle', {
                'campaignId': state.communication._id,
                'uuidChosen': clickedItemData.uuid,
                'buttonName': 'toggle_off'
            })
        }
    });
}

const handleNotValidAudience = (uploadedCounter, allAudienceCounter) => {
    if (uploadedCounter < allAudienceCounter) {
        $w("#usersWereNotAddedErrorText").text = constants.Text.USERS_WERE_NOT_UPLOADED(allAudienceCounter - uploadedCounter);
        showToast('usersWereNotAddedError', 10000);
    } else {
        $w("#uploadCSVSuccessText").text = constants.Text.USERS_WERE_UPLOADED(uploadedCounter);
        showToast('uploadCSVSuccessToast', 3000);
    }
}

function getReapeater() {
    const currentState = $w("#usersUuidsMultiState").currentState;
    return stateToRepeaterMap[currentState.id];
}
