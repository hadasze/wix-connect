import { redirectToMyCommunications } from 'public/_utils.js';

$w.onReady(function () {
    $w('#closeButton').onClick(async (event) => {
        redirectToMyCommunications();
    })
});