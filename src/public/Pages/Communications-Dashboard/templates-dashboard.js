import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

import { Text, CommunicationDahboardStates, Urls } from '../../consts.js';
import { SmartRepeater } from '../../smart-repeater.js';
import { setTemplateActionsEvents } from './templates-actions.js';

import { getAllUserCommunications } from 'backend/data-methods-wrapper.jsw';


const routerData = wixWindow.getRouterData();

export const initTemplatesDashboardData = () => {
    setTemplatesRepeater();
    setButtonsData();
}

const setButtonsData = () => {
    $w('#allTemplatesButton').label = `${CommunicationDahboardStates.ALL} ${routerData.templates}`;
}

const setTemplatesRepeater = async () => {
    const filters = { 'isTemplate': true };
    const itemReadyFun = ($item, itemData, index) => {
        $item('#templateNameText').text = itemData.name || Text.NO_NAME;
        $item('#lastEditedTemplateDateText').text = Text.EDITED_ON + itemData._updatedDate;
        setTemplateActionsUI($item, itemData);
        setTemplateActionsEvents($item, itemData);
    }

    const smartTemplatesRepeater = new SmartRepeater($w('#myTemplatesRepeater'), $w('#myTemplateItemBox'), getAllUserCommunications, filters, itemReadyFun);
    smartTemplatesRepeater.initRepeater();
}

const setTemplateActionsUI = ($item, itemData) => {
    let clicked = false;
    !$item('#templateActionsBox').collapsed && $item('#templateActionsBox').collapse();
    $item('#seeMoreTemplateActionsButton').onClick((event) => {
        $item('#templateActionsBox').expand();
        clicked = true;
    })
    //cr to change after talking with UX and changing the box limits
    $item('#box222').onClick(() => {
        wixLocation.to(Urls.PREVIEW + itemData._id)
    })
    $item('#templateActionsBox').onMouseOut((event) => {
        $item('#templateActionsBox').collapse().then(() => clicked = false);
        if ($item('#templateActionsBox').collapsed && clicked) $item('#templateActionsBox').expand();
    })
}