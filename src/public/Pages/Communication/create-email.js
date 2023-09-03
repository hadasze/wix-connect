// @ts-ignore
import wixWindow from 'wix-window';

import { autorun } from 'mobx';
import { state } from './state-management.js';
import { targetAudienceState } from './Target-Audience/target-audience.js';
import { addDynamicValue } from '../helpers.js';
import { sendBi } from '../../BI/biModule.js';

import * as constants from '../../consts.js';

let focusedElement = $w('#communicationInputTextBox');

export const initCreateEmailActions = () => {
    setLeftSidePannelEvents();
    setCommunicationTemplateEvents();
}

export const initCreateEmailData = () => {
    setCommunicationData();
}

const setCommunicationData = () => {
    autorun(() => $w('#communicationInputTextBox').value = `${state.communication?.template?.data?.body || ''}`);
    autorun(() => $w('#finalGreetingInput').value = `${state.communication?.signature?.finalGreeting || $w('#finalGreetingInput').value}`);
    autorun(() => $w('#fullNameInput').value = `${state.communication?.signature?.fullName || $w('#fullNameInput').value}`);
    autorun(() => $w('#jobTitleInput').value = `${state.communication?.signature?.jobTitle || $w('#jobTitleInput').value}`);
    autorun(() => $w('#signatureFullName').text = `${state.communication?.signature?.fullName || $w('#fullNameInput').value}`);
    autorun(() => $w('#signatureJobTitle').text = `${state.communication?.signature?.jobTitle || $w('#jobTitleInput').value}`);
    autorun(() => $w('#overviewCountMailText').text = constants.Text.WILL_BE_SENT_TO(targetAudienceState.approvedCounter));
}

const setLeftSidePannelEvents = () => {
    $w("#signatureBoxToggle").onChange((event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            $w('#SignatureContent').expand();
            $w('#signatureBox').expand();
            state.setSignatureFullName($w('#fullNameInput').value);
            state.setSignatureJobTitle($w('#jobTitleInput').value)
            sendBi('emailAdditions', { 'campaignId': state.communication._id, 'buttonName': 'signature_on' })
        } else {
            $w('#SignatureContent').collapse();
            $w('#signatureBox').collapse();
            state.setSignatureFullName('');
            state.setSignatureJobTitle('')
            sendBi('emailAdditions', { 'campaignId': state.communication._id, 'buttonName': 'signature_off' })
        }
    });
    $w('#fullNameInput').onInput((event) => {
        state.setSignatureFullName(event.target.value);
    });

    $w('#jobTitleInput').onInput((event) => {
        state.setSignatureJobTitle(event.target.value);
    });

    $w('#finalGreetingInput').onInput((event) => {
        state.setFinalGreeting(event.target.value);
    });

    $w('#addDynamicValueButton').onClick(async (event) => {
        const recievdData = await wixWindow.openLightbox(constants.Lightboxs.addDynamicValue, { 'communication': state.communication, 'BIorigin': 'createEmail' });
        if (recievdData) {
            const value = addDynamicValue(focusedElement, recievdData?.dynamicValue, recievdData?.fallBackValue);
            if (focusedElement.id === 'communicationInputTextBox')
                state.setTemplateBody(value);
            sendBi('emailAdditions', { 'campaignId': state.communication._id, 'buttonName': 'add_dynamic_values' })
        }
    })

    $w('#addDynamicValueButton').onMouseIn((event) => {
        $w('#dynamicValueTooltip').show();
    })

    $w('#addDynamicValueButton').onMouseOut((event) => {
        $w('#dynamicValueTooltip').hide();
    })

    $w('#exploreTextValuesBtn').onClick((event) => {
        sendBi('emailAdditions', { 'campaignId': state.communication._id, 'buttonName': 'explore_text_templates' })
    });
}

const setCommunicationTemplateEvents = () => {

    $w('#communicationInputTextBox').onChange((event) => {
        state.setTemplateBody(event.target.value);
        if (event.target.value === '<p> </p>') {
            state.setTemplateBody(null);
        }
    });

    $w('#communicationInputTextBox').onFocus((event) => {
        focusedElement = $w('#communicationInputTextBox');
    });
}
