import { redirectToMyCommunications } from 'public/_utils.js';

$w.onReady(function () {
    $w('#backToDashboardContinueBtn').onClick((event) => {
        redirectToMyCommunications();
    })
});