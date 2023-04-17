

import { HTMLgenerator } from 'backend/templates-helper/generate-html-handler.jsw';

//ALL IN COMMENTS BECAUSE FIRST VERSION WITHOUT MOBILE VIEW

export const initPreviewUIData = (communication) => {
    // setShowPreviewButtons(communication);
    setDesktopPreview(communication)
}

// async function setShowPreviewButtons(communication) {
//     // const generatedHTML = await HTMLgenerator(communication);
//     // $w('#desktopButton').onClick((event) => {
//     //     setDesktopPreview(communication)
//     // })
//     // $w('#mobileButton').onClick((event) => {
//     //     setMobilePreview(generatedHTML, communication)
//     // })
// }

const setDesktopPreview = async (communication) => {
    const generatedHTML = await HTMLgenerator(communication);
    // $w('#mobileTemplateCustomElement').setAttribute('html', `<div/>`);
    // $w('#mobileDesktopPreviewMultistateBox').changeState('Desktop').then(() => {
        $w('#desktopTemplateCustomElement').setAttribute('html', `<div/>`);
        $w('#desktopTemplateCustomElement').setAttribute('html', generatedHTML);
    // });
}

// const setMobilePreview = async (generatedHTMLl, communication) => {
//     const generatedHTML = await HTMLgenerator(communication);
//     $w('#desktopTemplateCustomElement').setAttribute('html', `<div/>`);
//     // $w('#mobileDesktopPreviewMultistateBox').changeState('Mobile').then(() => {
//         // $w('#mobileTemplateCustomElement').setAttribute('html', generatedHTML);
//     // });
// }

// export const cleanAllPreviewData = () => {
//     // $w('#mobileTemplateCustomElement').setAttribute('html', `<div/>`);
//     $w('#desktopTemplateCustomElement').setAttribute('html', `<div/>`);
// }