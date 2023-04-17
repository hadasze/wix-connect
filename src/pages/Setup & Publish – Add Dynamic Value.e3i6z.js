import wixWindow from 'wix-window';
import { DynamicFieldsOptions } from 'public/consts.js';
import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    const receivedData = wixWindow.lightbox.getContext();
    $w('#dynamicValueDropdown').options = [{ "label": DynamicFieldsOptions.BusinessName, "value": DynamicFieldsOptions.BusinessName },
        { "label": DynamicFieldsOptions.UserWebsiteURL, "value": DynamicFieldsOptions.UserWebsiteURL },
    ]

    $w('#dynamicValueDropdown').onChange((event) => {
        if (!$w('#dynamicValueErrIndicationBox').collapsed) {
            $w('#dynamicValueErrIndicationBox').collapse();
        }
    });

    $w('#addValueButton').onClick((event) => {
        if ($w('#dynamicValueDropdown').value) {
            const dynamicValue = $w('#dynamicValueDropdown').value;
            const fallBackValue = $w('#fallbackValueInput').value;
            if (dynamicValue) {
                sendBi('dynamicValues', { 'value': dynamicValue, 'campaignId': receivedData.communication._id, 'origin': receivedData.BIorigin, 'buttonName': 'add_value' })
                wixWindow.lightbox.close({ dynamicValue, fallBackValue });
            }
        } else {
            $w('#dynamicValueErrIndicationBox').expand();
        }
    });
    $w('#cancelDynamicValueBtn').onClick((event) => {
        sendBi('dynamicValues', { 'campaignId': receivedData.communication._id, 'origin': receivedData.BIorigin, 'buttonName': 'cancel' })
    });
});