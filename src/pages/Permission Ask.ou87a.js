import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    $w('#permissionRequestBtn').onClick((event) => {
        sendBi('permissionRequest', {})
    });
})