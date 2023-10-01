// @ts-ignore
import { HTMLgenerator } from 'backend/templates-helper/generate-html-handler.jsw';
import { autorun } from 'mobx';
import { Text } from '../../consts.js';

export const initPreviewData = (state, targetAudienceState) => {
    setUIData(state, targetAudienceState);
    setDesktopPreview(state);
}

function setUIData(state, targetAudienceState) {
    autorun(() => $w('#overviewCountSentMailText').text = Text.WILL_BE_SENT_TO(targetAudienceState.approvedCounter));
    autorun(() => $w('#testAndSendSenderNamePreviewText').text = state.communication?.finalDetails?.senderName);
    autorun(() => $w('#testAndSendSubjectLinePreviewText').text = state.communication?.finalDetails?.subjectLine);
    autorun(() => $w('#testAndSendPreviewText').text = state.communication?.finalDetails?.previewText);

}

const setDesktopPreview = (state) => {
    autorun(async () => {
        const generatedHTML = await HTMLgenerator(state.communication);

        if ($w('#mobileTemplateCustomElement').rendered)
            $w('#mobileTemplateCustomElement').setAttribute('html', `<div/>`);
        if ($w('#mobileDesktopPreviewMultistateBox').rendered)
            await $w('#mobileDesktopPreviewMultistateBox').changeState('Desktop');
        $w('#desktopTemplateCustomElement').setAttribute('html', generatedHTML);

    });
}
