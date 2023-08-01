// @ts-ignore
import wixLocation from 'wix-location';

import { SmartRepeater } from '../../smart-repeater.js';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import { removeItemFromRepeater } from '../../_utils.js';
import { state } from './state-manager.js';

import * as constants from '../../consts.js';

// @ts-ignore
import * as DataMethods from 'backend/data-methods-wrapper.jsw';
import { autorun } from 'mobx';


export const initTemplatesDashboardData = () => {
    setTemplatesRepeater();
    setButtonsData();
}

const setButtonsData = () => {
    autorun(() => Comp.allTemplatesButton.label = `${constants.CommunicationDahboardStates.ALL} ${state.communicationsCounts.templates}`);
}

const setTemplatesRepeater = async () => {

    const filters = { 'isTemplate': true };
    const itemReadyFun = ($item, itemData, index) => {
        $item('#templateNameText').text = itemData.name || constants.Text.NO_NAME;
        $item('#lastEditedTemplateDateText').text = constants.Text.EDITED_ON + itemData._updatedDate;
    }

    const smartTemplatesRepeater = new SmartRepeater(Comp.myTemplatesRepeater, Comp.myTemplateItemBox, DataMethods.getAllUserCommunications, filters, itemReadyFun);
    smartTemplatesRepeater.initRepeater();

    setTemplateActionsEvents(smartTemplatesRepeater);
    setTemplateActionsUI();
}

const setTemplateActionsUI = () => {


    Comp.seeMoreTemplateActionsButton.onClick((event) => {
        console.log('click');
        // @ts-ignore
        const $item = $w.at(event.context);
        $item('#templateActionsBox').collapsed ? $item('#templateActionsBox').expand() : $item('#templateActionsBox').collapse();
    })

    Comp.templatesItemInfoBox.onClick((event) => {
        wixLocation.to(constants.Urls.PREVIEW + event.context.itemId);
    })

    Comp.myTemplateItemBox.onMouseOut((event) => {
        // @ts-ignore
        const $item = $w.at(event.context);
        $item('#templateActionsBox').collapse();
    })
}


export const setTemplateActionsEvents = (smartTemplatesRepeater) => {

    Comp.editTempalteButton.onClick((event) => {
        wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + event.context.itemId);
    })


    Comp.duplicateTemplateButton.onClick(async (event) => {
        event.target.disable();
        const data = Comp.myTemplatesRepeater.data;
        let clickedItemData = data.find(item => item._id === event.context.itemId);
        const { _id, _createdDate, _updatedDate, _owner, ...rest } = clickedItemData;

        try {

            // const newTemplate =
            await DataMethods.saveCommunication(rest);
            // const newData = [newTemplate, ...Comp.myTemplatesRepeater.data];
            // Comp.myTemplatesRepeater.data = newData;
            smartTemplatesRepeater.resetRepeater();
            state.communicationsCounts.templates++;
            event.target.enable();

        } catch (err) {
            console.error('public/templates-dashboard duplicate template ', err);
        }
    })

    Comp.deleteTemplateButton.onClick(async (event) => {
        event.target.disable();
        await DataMethods.removeCommunication(event.context.itemId);
        // removeItemFromRepeater(Comp.myTemplatesRepeater, event.context.itemId);
        smartTemplatesRepeater.resetRepeater();
        state.communicationsCounts.templates--;
    })
}