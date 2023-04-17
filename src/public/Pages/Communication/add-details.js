import { autorun } from 'mobx';
import { state } from 'public/Pages/Communication/state-management.js'

export const initAddDetailsActions = () => {
    setAddDetailsEvents();
}

export const initAddDetailsData = () => {
    setCommunicationDetailsData();
}

const setCommunicationDetailsData = () => {
    $w("#communicationNameInput").maxLength = 60;
    $w("#communicationDescriptionTextBox").maxLength = 200;
    autorun(() => $w('#communicationNameInput').value = `${state.communication?.name || ''}`);
    autorun(() => $w('#communicationDescriptionTextBox').value = `${state.communication?.description || ''}`);
}

const setAddDetailsEvents = () => {
    $w('#communicationNameInput').onInput((event) => {
        state.setCommunicationName(event.target.value);
    });

    $w('#communicationDescriptionTextBox').onInput((event) => {
        state.setCommunicationDescription(event.target.value);
    });
}