import { state } from './Communication/state-management.js';
import { DynamicFieldsOptions } from '../consts.js';

export const disbaleCurrentButton = (currButton, allButtonsArr) => {
    for (let i = 0; i < allButtonsArr.length; i++) {
        if (currButton === allButtonsArr[i])
            $w('#' + currButton).disable();
        else
            $w('#' + allButtonsArr[i]).enable();
    }
}

export const addDynamicValue = (component, dynamicValue, fallBackValue) => {
    const strHtml = component.value;
    let n = strHtml.lastIndexOf("</span></p>");
    if (component.type === '$w.TextInput') {
        component.value = strHtml + ' {' + dynamicValue + '} ';
    } else if (component.type === '$w.RichTextBox') {
        if (n < 1)
            n = strHtml.lastIndexOf("</p>");
        component.value = strHtml.substring(0, n) + ' {' + dynamicValue + '} ' + strHtml.substring(n);
    }

    evaluateFallBackValue(dynamicValue, fallBackValue)
    return component.value;
}

export const evaluateFallBackValue = (dynamicValue, fallBackValue = '') => {
    switch (dynamicValue) {
    case DynamicFieldsOptions.BusinessName:
        state.setBusinessName(fallBackValue);
        break;
    case DynamicFieldsOptions.UserFirstName:
        state.setUserFirstName(fallBackValue);
        break;
    case DynamicFieldsOptions.UserWebsiteURL:
        state.setUserWebsiteUrl(fallBackValue);
        break;
    default:
        console.error('doesnt exist dynamic value');
    }
}

export function contains(array, item) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.uuid === item.uuid)
            return true;
    }
    return false;
}

export const getMustHaveFieldsOfCommunication = (communication) => {

    const emailContent = communication?.template?.data?.body;
    const subjectLine = communication?.finalDetails?.subjectLine;
    const previewText = communication?.finalDetails?.previewText;
    const fullName = communication?.signature?.fullName;
    const positionTitle = communication?.signature?.jobTitle;
    const finalGreeting = communication?.signature?.finalGreeting;
    const senderName = communication?.finalDetails?.senderName;
    const replyToAddress = communication?.finalDetails?.replyToAddress;

    return { emailContent, subjectLine, previewText, fullName, positionTitle, finalGreeting, senderName, replyToAddress };
}