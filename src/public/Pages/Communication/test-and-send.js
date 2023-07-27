// @ts-ignore
import wixWindow from 'wix-window';
import { observable, autorun } from 'mobx';

import { state } from './state-management.js';
import { addDynamicValue } from '../helpers.js';
import { sendBi } from '../../BI/biModule.js';

import * as constants from '../../consts.js';

const counters = observable({
    subjectLineCounter: $w('#subjectLineInput').value.length,
    previewCounter: $w('#previewTextInput').value.length,
    setSubjectLineCounter(subjectLineCounter) {
        counters.subjectLineCounter = subjectLineCounter;
    },
    setPreviewCounter(previewCounter) {
        counters.previewCounter = previewCounter;
    },
})

export const initTestAndSendActions = () => {
    setTestAndSendInputsEvents();
    setSubjectLineActions();
    setPreviewTextActions();
}

export const initTestAndSendData = () => {
    setTestAndSendData();
}

const setTestAndSendData = () => {
    autorun(() => $w('#senderNameInput').value = `${state.communication?.finalDetails?.senderName || ''}`);
    autorun(() => $w('#subjectLineInput').value = `${state.communication?.finalDetails?.subjectLine || ''}`);
    autorun(() => $w('#previewTextInput').value = `${state.communication?.finalDetails?.previewText || ''}`);
    autorun(() => $w('#replyToAddressInput').value = `${state.communication?.finalDetails?.replyToAddress || ''}`);
    autorun(() => $w('#senderNamePreviewText').text = `${state.communication?.finalDetails?.senderName || $w('#senderNameInput').value}`);
    autorun(() => $w('#subjectLinePreviewText').text = `${state.communication?.finalDetails?.subjectLine || $w('#subjectLineInput').value}`);
    autorun(() => $w('#previewText').text = `${state.communication?.finalDetails?.previewText || $w('#previewTextInput').value}`);
    autorun(() => $w('#subjectLineInputLengthCounter').text = counters.subjectLineCounter + '/150');
    autorun(() => $w('#previewInputLengthCounter').text = counters.previewCounter + '/150');
}

const setTestAndSendInputsEvents = () => {
    $w("#subjectLineInput").maxLength = 150;
    $w("#previewTextInput").maxLength = 150;
    $w('#subjectLineInputLengthCounter').text = counters.subjectLineCounter + '/150';
    $w('#previewInputLengthCounter').text = counters.previewCounter + '/150';
    $w('#senderNameInput').onInput((event) => {
        state.setSenderName(event.target.value);
    });
    $w('#subjectLineInput').onInput((event) => {
        state.setSubjectLine(event.target.value);
        counters.setSubjectLineCounter(event.target.value.length.toString())
    });
    $w('#previewTextInput').onInput((event) => {
        state.setPreviewText(event.target.value);
        counters.setPreviewCounter(event.target.value.length.toString())
    });
    $w('#replyToAddressInput').onInput((event) => {
        state.setAddressToReply(event.target.value);
    });
}

const setSubjectLineActions = () => {
    let clicked = false;
    !$w('#subjectLineOptionsBox').collapsed && $w('#subjectLineOptionsBox').collapse();
    $w('#subjectLinePlusButton').onClick((event) => {
        $w('#subjectLineOptionsBox').expand();
        clicked = true;
    })
    $w('#subjectLineOptionsBox').onMouseOut((event) => {
        $w('#subjectLineOptionsBox').collapse().then(() => clicked = false);
        if ($w('#subjectLineOptionsBox').collapsed && clicked) $w('#subjectLineOptionsBox').expand();
    })
    $w('#addDynamicValueToSubjectLineBtn').onClick(async (event) => {
        const recievdData = await wixWindow.openLightbox(constants.Lightboxs.addDynamicValue, { 'communication': state.communication, 'BIorigin': 'testAndSend' });
        const value = addDynamicValue($w('#subjectLineInput'), recievdData.dynamicValue, recievdData.fallBackValue);
        state.setSubjectLine(value);
        sendBi('plusClick', { 'campaignId': state.communication._id, 'origin': 'subject_line', 'button_name': 'add_dynamic_value' })
    })
    $w('#exploreTextTemplateBtn').onClick(async (event) => {
        sendBi('plusClick', { 'campaignId': state.communication._id, 'origin': 'subject_line', 'button_name': 'explore_text_templates' })
    })
}

const setPreviewTextActions = () => {
    let clicked = false;
    !$w('#previewTextOptionsBox').collapsed && $w('#previewTextOptionsBox').collapse();
    $w('#previewTextPlusButton').onClick((event) => {
        $w('#previewTextOptionsBox').expand();
        clicked = true;
    })
    $w('#previewTextOptionsBox').onMouseOut((event) => {
        $w('#previewTextOptionsBox').collapse().then(() => clicked = false);
        if ($w('#previewTextOptionsBox').collapsed && clicked) $w('#previewTextOptionsBox').expand();
    })
    $w('#addDynamicValuePreviewTextBtn').onClick(async (event) => {
        const recievdData = await wixWindow.openLightbox(constants.Lightboxs.addDynamicValue, { 'communication': state.communication, 'BIorigin': 'testAndSend' });
        const value = addDynamicValue($w('#previewTextInput'), recievdData.dynamicValue, recievdData.fallBackValue);
        state.setPreviewText(value);
        sendBi('plusClick', { 'campaignId': state.communication._id, 'origin': 'preview_text', 'button_name': 'add_dynamic_value' })
    })
    $w('#exploreTextTemplateBtn').onClick(async (event) => {
        sendBi('plusClick', { 'campaignId': state.communication._id, 'origin': 'preview_text', 'button_name': 'explore_text_templates' })
    })
}