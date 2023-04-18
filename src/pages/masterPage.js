import wixSite from 'wix-site';
import wixLocation from 'wix-location';

import {validateAccessToken, clearQueryParams} from '../login.js';

// redirect from blank home page
if (wixSite.currentPage.isHomePage) {
    const url = new URL(wixLocation.baseUrl + '/my-communications');
    if (wixLocation.query.siteRevision)
        url.searchParams.append('siteRevision', wixLocation.query.siteRevision);
    if (wixLocation.query.branchId)
        url.searchParams.append('branchId', wixLocation.query.branchId);
    wixLocation.to(url.toString());
}

$w.onReady(function () {
    clearQueryParams();
    refreshTokenTimeout();
});

let tokenExpire;

function refreshTokenTimeout() {
    validateAccessToken();
    if (tokenExpire) {
        clearTimeout(tokenExpire);
    }
    tokenExpire = setTimeout(() => refreshTokenTimeout(), 600000);
}