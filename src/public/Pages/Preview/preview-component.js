import { HTMLgenerator } from 'backend/templates-helper/generate-html-handler.jsw';

export const initPreviewUIData = (communication) => {
    setDesktopPreview(communication)
}

const setDesktopPreview = async (communication) => {
    const generatedHTML = await HTMLgenerator(communication);
    $w('#desktopTemplateCustomElement').setAttribute('html', `<div/>`);
    $w('#desktopTemplateCustomElement').setAttribute('html', generatedHTML);
}
