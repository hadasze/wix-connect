// @ts-ignore
import wixLocation from 'wix-location';
import { CommunicationDashboardPage as Comp } from '../../components.js';
import { removeItemFromRepeater } from '../../_utils.js';
import { state } from './state-manager.js';
import { formatDate } from './communications-dashboard.js';
import * as constants from '../../consts.js';

// @ts-ignore
import * as DataMethods from 'backend/data-methods-wrapper.jsw';
import { autorun } from 'mobx';


export const initTemplatesDashboardData = () => {
    Comp.myTemplatesRepeater.onItemReady(($item, itemData, index) => {
        $item('#templateNameText').text = itemData.name || constants.Text.NO_NAME;
        const date = formatDate(itemData._updatedDate);
        $item('#lastEditedTemplateDateText').text = constants.Text.EDITED_ON + date;
    })
    setTemplateActionsEvents();
    setTemplateActionsUI();
    autorun(() => {
        const filteredItems = state.communications.filter((item) => !item.archive && item.isTemplate);
        Comp.myTemplatesRepeater.data = filteredItems || [];
        setButtonsData(filteredItems.length.toString());
    });
}

const setButtonsData = (count) => {
    Comp.allTemplatesButton.label = `${constants.CommunicationDahboardStates.ALL} ${count}`;
}

const setTemplateActionsUI = () => {


    Comp.seeMoreTemplateActionsButton.onClick((event) => {
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


export const setTemplateActionsEvents = () => {

    Comp.editTempalteButton.onClick((event) => {
        wixLocation.to(constants.Urls.EXISTS_COMMUNICATION + event.context.itemId);
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
            state.communications = [newTemplate, ...state.communications];
            event.target.enable();
        } catch (err) {
            console.error('public/templates-dashboard duplicate template ', err);
        }
    })

    Comp.deleteTemplateButton.onClick(async (event) => {
        event.target.disable();
        await DataMethods.removeCommunication(event.context.itemId);
        removeItemFromRepeater(Comp.myTemplatesRepeater, event.context.itemId);
        state.communications = state.communications.filter((item) => item._id !== event.context.itemId);
    })
}