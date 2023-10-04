import { sendBi } from 'public/BI/biModule.js';
import wixLocation from 'wix-location';
import { local } from 'wix-storage';

$w.onReady(function () {
    
    $w('#seeGuidelinesBtn').onClick((event) => {
        sendBi('seeGuidelines', {});
        local.removeItem('tokenset');
        local.removeItem('userInfo');
        wixLocation.to('https://www.wix-smart.com/admin/tool/course/selfenrol.php?id=8333')
    });

})