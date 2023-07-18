import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { toJS } from 'mobx';
import { state } from 'public/Pages/Communication/state-management.js';
import { disbaleCurrentButton } from 'public/Pages/helpers.js';
import { initPreviewUIData } from 'public/Pages/Preview/preview-component.js';
import { prepareSentCommunicationsDetails } from 'public/Pages/Communications-Dashboard/communications-dashboard.js'
import { getDownloadFileUrlFromArray, getAudienceDetails as getAudienceDetailsBE } from 'backend/target-audience-handler-wrapper.jsw';
import { getAudienceDetails } from 'public/audience-handler.js';
import * as roles from 'public/Pages/Communication/Target-Audience/filters-roles.js';
import { AllPreviewSectionsButtons } from 'public/consts.js'
import { getUserJWTToken } from '../../_utils';

let currCommunication = wixWindow.getRouterData();

export const initCommunicationPreviewData = () => {
    setCommunicationDeatilsPreviewData();
}

export const initCommunicationPreviewActions = () => {
    setCommunicationPreviewEvents();
}

const setCommunicationDeatilsPreviewData = () => {
    initPreviewDetailsHeaderData();
    initPreviewDetailsRepeaterData();
    initPreviewUIData(currCommunication);
}

const setCommunicationPreviewEvents = () => {
    $w('#previewButton').onClick((event) => {
        $w('#previewSectionsMultiStateBox').changeState('previewState');
        disbaleCurrentButton('previewButton', AllPreviewSectionsButtons);
    })

    $w('#detailsButton').onClick((event) => {
        $w('#previewSectionsMultiStateBox').changeState('detailsState');
        disbaleCurrentButton('detailsButton', AllPreviewSectionsButtons);
    })

    $w('#downloadReportButton').onClick((event) => {
        downloadReportEvent();
    })

    $w('#needHelpButton').onClick((event) => {
        wixWindow.openLightbox('Need Help Sidebar');
    });
}

const downloadReportEvent = () => {
    $w('#downloadReportButton').onClick(async (event) => {
        try {
            $w('#downloadReportButton').disable();
            const uuidsAndMsidsList = (Object.values(toJS(state.communication.targetAudience)))
            const audienceData = await getAudienceDetails(uuidsAndMsidsList);
            const url = await getDownloadFileUrlFromArray(audienceData.approved, "allSentUsers");
            wixLocation.to(url);
            $w('#downloadReportButton').enable();
        } catch (err) {
            console.error("downloadSentUsersReportEvent error, original error: ", err);
        }
    })
}

const initPreviewDetailsHeaderData = async () => {
    try {
        $w('#deliveredEmailCounterText, #deliveredPercentageText, #openedEmailCounterText, #openedPercentageText, #deliveredText, #openedText').hide();

        const communicationDetails = await prepareSentCommunicationsDetails();

        const subjectLine = (currCommunication.finalDetails.subjectLine).toLowerCase();
        const deliveredCount = communicationDetails[subjectLine]?.delivered ? (communicationDetails[subjectLine]?.delivered).toString() : '0';
        const openedCount = communicationDetails[subjectLine]?.opened ? (communicationDetails[subjectLine]?.opened).toString() : '0';

        if (deliveredCount && openedCount && +deliveredCount != 0) {
            $w('#deliveredEmailCounterText').text = deliveredCount;
            $w('#openedEmailCounterText').text = openedCount;
            $w('#deliveredPercentageText').text = calculatePercentage(deliveredCount) + '%';
            $w('#openedPercentageText').text = calculatePercentage(openedCount) + '%';
            $w('#deliveredEmailCounterText, #deliveredPercentageText, #openedEmailCounterText, #openedPercentageText, #deliveredText, #openedText').show();
        }
    } catch (err) {
        console.error('initPreviewDetailsHeaderData, couldnt get sent communication Details, original error: ', err)
    }
    $w('#sentEmailCounterText').text = currCommunication.sentToCounter.toString();
}

const initPreviewDetailsRepeaterData = async () => {
    try {
        $w('#sentEmailUsersRepeater').data = [];
        let finalSentToAudience = currCommunication.finalSentToAudience;

        if (!Array.isArray(finalSentToAudience)) {
            finalSentToAudience = Object.values(currCommunication.finalSentToAudience);
        }

        const userJWT = await getUserJWTToken();
        const toCheck = finalSentToAudience.map((item) => {
            const { uuid, msid } = item;
            return { uuid, msid };
        })
        const getAudienceDetailsBERes = await getAudienceDetailsBE(toCheck, userJWT, false);
        $w('#sentEmailUsersRepeater').data = getAudienceDetailsBERes.data.marketing;
        $w('#sentEmailUsersRepeater').onItemReady(($item, itemData, index) => {
            $item('#userUUIDButton').label = itemData.uuid;
            $item('#userNameText').text = itemData.site_display_name || '';
            $item('#siteUrlText').text = itemData.url || '';
            setRepeaterActions($item, itemData)
            roles.setSentUuidProperties(itemData, $item, 'Sent');
        });
    } catch (err) {
        console.error('initPreviewDetailsRepeaterData error, original error: ', err);
    }
}

const setRepeaterActions = ($item, itemData) => {
    $item('#copyToClipboardHover').hide();

    $item('#copyToClipboardButton').onMouseIn(() => {
        $item('#copyToClipboardHover').show();
    })
    $item('#copyToClipboardButton').onMouseOut(() => {
        $item('#copyToClipboardHover').hide();
    });
    $item('#copyToClipboardButton').onClick(() => {
        wixWindow.copyToClipboard(itemData.uuid)
    });
    $item('#siteUrlText').onClick(() => {
        wixLocation.to(itemData.url)
    });
}

const calculatePercentage = (partialValue) => {
    return (Math.round((100 * partialValue) / currCommunication.sentToCounter).toString());
}