// @ts-ignore
import wixLocation from 'wix-location';
// @ts-ignore
import wixWindow from 'wix-window';
// @ts-ignore
import { local } from 'wix-storage';

import { Urls } from './consts.js';
import { getTokenset } from './login.js';
import { Lightboxs } from './consts.js';

export function lowerize(obj) {
    return Object.keys(obj).reduce((acc, k) => {
        acc[k.toLowerCase()] = obj[k];
        return acc;
    }, {});
}

export const isArray = (obj) => Array.isArray(obj);

export function isUUID(str) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(str);
}

export function redirectToMyCommunications(withBaseURL) {
    const url = new URL(wixLocation.baseUrl + Urls.MY_COMMUNICATIONS_DASHOBOARD);
    if (wixLocation.query.siteRevision)
        url.searchParams.append('siteRevision', wixLocation.query.siteRevision);
    if (wixLocation.query.branchId)
        url.searchParams.append('branchId', wixLocation.query.branchId);
    const redirectURL = withBaseURL ? url.toString() : url.toString().replace(wixLocation.baseUrl, '');
    wixLocation.to(redirectURL);
}

export async function getUserJWTToken() {
    const tokenset = await getTokenset();
    const userJWT = tokenset?.access_token;
    return userJWT;
}

export function removeItemFromRepeater(repeater, itemID) {
    const data = repeater.data;
    const filteredItems = data.filter((item) => item._id !== itemID);
    repeater.data = filteredItems;
}

export function getOwnerUUID() {
    const userInfoSTR = local.getItem('userInfo');
    const userInfo = JSON.parse(userInfoSTR);
    return userInfo.uuid;
}

export const openBanner = (msg) => wixWindow.openLightbox(Lightboxs.Banner, { msg });

export function updateQuery(key, value) {
    const toAdd = {};
    toAdd[key] = value;
    return wixLocation.queryParams.add(toAdd);
}