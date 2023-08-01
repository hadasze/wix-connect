import wixWindow from 'wix-window';
import { Banner as Comp } from 'public/components.js';

$w.onReady(function () {
    const { msg } = wixWindow.lightbox.getContext();
    Comp.msgText.text = msg;
    setTimeout(() => {
        wixWindow.lightbox.close();
    }, 4000);
});
