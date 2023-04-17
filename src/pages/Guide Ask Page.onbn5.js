import { sendBi } from 'public/BI/biModule.js';
import wixLocation from 'wix-location';


$w.onReady(function () {
    $w('#seeGuidelinesBtn').onClick((event) => {
        sendBi('seeGuidelines', {});
        wixLocation.to('https://www.wix-smart.com/admin/tool/course/selfenrol.php?id=8333')
    });
})