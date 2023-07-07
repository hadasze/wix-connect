import wixLocation from 'wix-location';
import { authentication } from 'wix-members-frontend';
import { Urls } from 'public/consts.js';
import { getTokenset } from './login.js';

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

export async function redirectToMyCommunications() {
    const url = new URL(wixLocation.baseUrl + Urls.MY_COMMUNICATIONS_DASHOBOARD);
    if (wixLocation.query.siteRevision)
        url.searchParams.append('siteRevision', wixLocation.query.siteRevision);
    if (wixLocation.query.branchId)
        url.searchParams.append('branchId', wixLocation.query.branchId);
    const userJWT = await getUserJWTToken();
    if (userJWT)
        return authentication.promptLogin();
    url.searchParams.append('token', userJWT);
    const relativeURL = url.toString().replace(wixLocation.baseUrl, '');
    wixLocation.to(relativeURL);
}

export async function getUserJWTToken() {
    const tokenset = await getTokenset();
    const userJWT = tokenset.access_token;
    return userJWT;
}