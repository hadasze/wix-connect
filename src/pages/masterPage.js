import wixSite from 'wix-site';
// import { redirectToMyCommunications } from 'public/_utils.js'
import { validateAccessToken, clearQueryParams } from '../login.js';
import wixLocation from 'wix-location';
// redirect from blank home page
// if (wixSite.currentPage.isHomePage) {
//     redirectToMyCommunications();
// } else {
    
// redirect from blank home page
if (wixSite.currentPage.isHomePage)
    wixLocation.to(wixLocation.baseUrl + '/my-communications');

    $w.onReady(function () {
        clearQueryParams();
        refreshTokenTimeout();
    });
// }

let tokenExpire;

function refreshTokenTimeout() {
    validateAccessToken();
    if (tokenExpire) {
        clearTimeout(tokenExpire);
    }
    tokenExpire = setTimeout(() => refreshTokenTimeout(), 600000);
}

