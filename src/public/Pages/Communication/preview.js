// @ts-ignore
import { HTMLgenerator } from 'backend/templates-helper/generate-html-handler.jsw';
import { state } from './state-management.js';
// import { autorun } from 'mobx';
import { targetAudienceState } from './Target-Audience/target-audience.js';
import { Text } from '../../consts.js';

// export const initPreviewActions = () => {
//     setShowPreviewButtons();
// }

export const initPreviewData = () => {
    setUIData();
    setDesktopPreview();
}

function setUIData() {
    // autorun(() =>
    $w('#overviewCountSentMailText').text = Text.WILL_BE_SENT_TO(targetAudienceState.approvedCounter);
    // );
}

// async function setShowPreviewButtons() {
//     // $w('#nextButton').hide(), $w('#nextButton').disable();
//     // $w('#sendTestButton').show(), $w('#sendTestButton').enable();
//     const generatedHTML = await HTMLgenerator(state.communication);
//     // $w('#desktopButton').onClick((event) => {
//     //     setDesktopPreview()
//     // })
//     // $w('#mobileButton').onClick((event) => {
//     //     setMobilePreview(generatedHTML)
//     // })
// }

const setDesktopPreview = async () => {
    const generatedHTML = await HTMLgenerator(state.communication);
    console.log($w('#mobileTemplateCustomElement'));
    $w('#mobileTemplateCustomElement').setAttribute('html', `<div/>`);
    $w('#mobileDesktopPreviewMultistateBox').changeState('Desktop').then(() => {
        $w('#desktopTemplateCustomElement').setAttribute('html', generatedHTML);
    });
}

// const setMobilePreview = async (generatedHTMLl) => {
//     const generatedHTML = await HTMLgenerator(state.communication);
//     $w('#desktopTemplateCustomElement').setAttribute('html', `<div/>`);
//     $w('#mobileDesktopPreviewMultistateBox').changeState('Mobile').then(() => {
//         $w('#mobileTemplateCustomElement').setAttribute('html', generatedHTML);
//     });
// }

// export const cleanAllPreviewData = () => {
//     $w('#mobileTemplateCustomElement').setAttribute('html', `<div/>`);
//     $w('#desktopTemplateCustomElement').setAttribute('html', `<div/>`);
// }