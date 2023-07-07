import wixLocation from "wix-location";
import { redirectToMyCommunications } from 'public/_utils.js';

$w.onReady(function () {
    $w('#button3').onClick(async (event) => {
        redirectToMyCommunications();
    })
});