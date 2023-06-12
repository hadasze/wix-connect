import wixLocation from "wix-location";
import { Urls } from 'public/consts.js';

$w.onReady(function () {
    $w('#button3').onClick(async (event) => {
        wixLocation.to(Urls.MY_COMMUNICATIONS_DASHOBOARD);
    })
});