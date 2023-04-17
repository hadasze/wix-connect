import wixLocation from 'wix-location';
import { Urls } from 'public/consts.js';
import { clickTemplatesButton } from 'public/Pages/Communications-Dashboard/top-bar.js';
import { saveCommunication, removeCommunication } from 'backend/data-methods-wrapper.jsw'

export const setTemplateActionsEvents = ($item, itemData) => {
    $item('#editTempalteButton').onClick((event) => {
        wixLocation.to(Urls.EXISTS_COMMUNICATION + itemData._id);
    })

    let duplicateTemplateButtonDebounceTimer;
    $item('#duplicateTemplateButton').onClick(async (event) => {
        delete itemData._id;
        try {
            await saveCommunication(itemData);
            if (duplicateTemplateButtonDebounceTimer) {
                clearTimeout(duplicateTemplateButtonDebounceTimer);
                duplicateTemplateButtonDebounceTimer = undefined;
            }

            duplicateTemplateButtonDebounceTimer = setTimeout(() => {
                wixLocation.to(wixLocation.url);
                // Binyaminm CR: this line will never read:
                clickTemplatesButton();
            }, 3000)
        } catch (err) {
            console.error('public/templates-dashboard duplicate template ', err);
        }
    })

    //added debounce in case the user want to delete more then one item
    let deleteTemplateButtonDebounceTimer;
    $item('#deleteTemplateButton').onClick(async (event) => {
        try {
            await removeCommunication(itemData._id);
            if (deleteTemplateButtonDebounceTimer) {
                clearTimeout(deleteTemplateButtonDebounceTimer);
                deleteTemplateButtonDebounceTimer = undefined;
            }

            deleteTemplateButtonDebounceTimer = setTimeout(() => {
                wixLocation.to(wixLocation.url);
                // Binyaminm CR: this line will never read:
                $w('#dashboardMultiState').changeState('myTemplatesState');
            }, 3000)

        } catch (err) {
            console.error('public/templates-dashboard delete template ', err);
        }
    })
}