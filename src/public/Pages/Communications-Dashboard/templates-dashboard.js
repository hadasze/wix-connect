// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import wixLocation from 'wix-location';

import { Text, CommunicationDahboardStates, Urls } from '../../consts.js';
import { SmartRepeater } from '../../smart-repeater.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import { removeItemFromRepeater } from '../../_utils.js';

// @ts-ignore
import * as DataMethods from 'backend/data-methods-wrapper.jsw';

const routerData = wixWindow.getRouterData();

export const initTemplatesDashboardData = () => {
    setTemplatesRepeater();
    setButtonsData();
}

const setButtonsData = () => {
    Comp.allTemplatesButton.label = `${CommunicationDahboardStates.ALL} ${routerData.templates}`;
}

const setTemplatesRepeater = async () => {
    setTemplateActionsEvents();
    setTemplateActionsUI();
    const filters = { 'isTemplate': true };
    const itemReadyFun = ($item, itemData, index) => {
        $item('#templateNameText').text = itemData.name || Text.NO_NAME;
        $item('#lastEditedTemplateDateText').text = Text.EDITED_ON + itemData._updatedDate;
    }

    const smartTemplatesRepeater = new SmartRepeater(Comp.myTemplatesRepeater, Comp.myTemplateItemBox, DataMethods.getAllUserCommunications, filters, itemReadyFun);
    smartTemplatesRepeater.initRepeater();
}

const setTemplateActionsUI = () => {

    
    Comp.seeMoreTemplateActionsButton.onClick((event) => {
        console.log('click');
        // @ts-ignore
        const $item = $w.at(event.context);
        $item('#templateActionsBox').collapsed ? $item('#templateActionsBox').expand() : $item('#templateActionsBox').collapse();
    })

    Comp.templatesItemInfoBox.onClick((event) => {
        wixLocation.to(Urls.PREVIEW + event.context.itemId);
    })

    Comp.myTemplateItemBox.onMouseOut((event) => {
        // @ts-ignore
        const $item = $w.at(event.context);
        $item('#templateActionsBox').collapse();
    })
}


export const setTemplateActionsEvents = () => {

    Comp.editTempalteButton.onClick((event) => {
        wixLocation.to(Urls.EXISTS_COMMUNICATION + event.context.itemId);
    })


    Comp.duplicateTemplateButton.onClick(async (event) => {
        event.target.disable();
        const data = Comp.myTemplatesRepeater.data;
        let clickedItemData = data.find(item => item._id === event.context.itemId);
        const { _id, _createdDate, _updatedDate, _owner, ...rest } = clickedItemData;

        try {
            const newTemplate = await DataMethods.saveCommunication(rest);
            const newData = [newTemplate, ...Comp.myTemplatesRepeater.data];
            Comp.myTemplatesRepeater.data = newData;
            event.target.enable();

        } catch (err) {
            console.error('public/templates-dashboard duplicate template ', err);
        }
    })

    Comp.deleteTemplateButton.onClick((event) => {
        event.target.disable();
        DataMethods.removeCommunication(event.context.itemId);
        removeItemFromRepeater(Comp.myTemplatesRepeater, event.context.itemId);
    })
}