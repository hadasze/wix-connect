import * as previewHandler from 'public/Pages/Communication/preview.js';
import wixWindow from 'wix-window';

$w.onReady(function () {
    const { state, targetAudienceState } = wixWindow.lightbox.getContext();
    previewHandler.initPreviewData(state, targetAudienceState);
});
