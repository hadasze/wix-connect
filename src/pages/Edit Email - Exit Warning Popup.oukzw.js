import wixLocation from 'wix-location';
import { Urls } from 'public/consts.js'

$w.onReady(function () {
    $w('#backToDashboardContinueBtn').onClick((event) => {
        wixLocation.to(Urls.MY_COMMUNICATIONS_DASHOBOARD);
    })
});