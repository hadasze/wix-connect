import wixMembers from 'wix-members';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import wixSite from 'wix-site';
import { local } from 'wix-storage';

import * as Login from 'backend/Login/login.jsw';

const { baseUrl, path, prefix } = wixLocation;
const redirectUri = baseUrl + (prefix ? "/" + prefix + "/" + path : path[0] ? "/" + path[0] : "/");

const query = wixLocation.query;

export const authorizationEndpoint = Login.getAuthorizationEndpoint(redirectUri);

export function login() {
    if (wixWindow.rendering.env === 'browser') {
        if (query?.code) {
            return Login.getSessionToken(redirectUri, wixLocation.url)
                .then(({ sessionToken, tokenset, userInfo }) => {
                    return doLogin(sessionToken, tokenset, userInfo);
                }).catch((error) => {
                    return Promise.reject('public/login.js -> login failed - origin error - ' + error);
                });
        }

        if (query?.access_token && query?.isqa) {
            return Login.qaLogin(query.access_token)
                .then(({ sessionToken, tokenset, userInfo }) => {
                    return doLogin(sessionToken, tokenset, userInfo);
                }).catch((error) => {
                    return Promise.reject('public/login.js -> qaLogin failed - origin error - ' + error);
                });
        }

        return false
    }
}

function doLogin(sessionToken, tokenset, userInfo) {
    if (sessionToken && tokenset && userInfo) {
        storeTokenAndUserInfo(tokenset, userInfo);
        return wixMembers.authentication.applySessionToken(sessionToken);
    }
}

wixMembers.authentication.onLogout((event) => {
    local.removeItem('tokenset');
    local.removeItem('userInfo');
})

export async function validateAccessToken() {

    try {
        if (wixWindow.rendering.env === 'browser') {
            const tokensetSTR = local.getItem('tokenset');
            const userInfoSTR = local.getItem('userInfo');
            if (tokensetSTR && userInfoSTR) {
                const tokenset = JSON.parse(tokensetSTR);
                const userInfo = JSON.parse(userInfoSTR);
                if (tokenset.access_token && tokenset.refresh_token && userInfo.groups) {
                    const introspectAccessTokenRes = Login.introspect(tokenset.access_token);
                    const introspectRefreshTokenRes = Login.introspect(tokenset.refresh_token);
                    if ((await introspectAccessTokenRes).active) {
                        // if (userInfo?.email !== 'binyaminm@wix.com')
                        //     return wixLocation.to('/system-down');

                        if (userInfo.groups.includes('ero-wix-connect')) {
                            if (wixSite.currentPage?.url === '/guide-ask-page') {
                                wixLocation.to('/');
                            } else {
                                return tokenset;
                            }
                        } else {
                            return wixLocation.to('/guide-ask-page');
                        }
                    } else {
                        if ((await introspectRefreshTokenRes).active) {
                            await refreshToken();
                            return validateAccessToken();
                        }
                        wixMembers.authentication.logout();
                    }
                } else {
                    if (await Login.isQAMember(tokenset?.access_token)) {
                        return tokenset;
                    }
                    wixMembers.authentication.logout();
                }
            }
            wixMembers.authentication.logout();
        }
    } catch (error) {
        console.error('public/login -> validateAccessToken failed - origin error - ' + error);
        wixMembers.authentication.logout();

    }
}

export async function refreshToken() {
    try {
        const tokensetSTR = local.getItem('tokenset');
        const tokenset = JSON.parse(tokensetSTR);
        const newTokenset = await Login.refreshToken(tokenset.refresh_token);
        const userInfo = await Login.getUserinfo(newTokenset.access_token);
        storeTokenAndUserInfo(newTokenset, userInfo);
        return
    } catch (error) {
        return Promise.reject('public/login -> refreshToken failed - origin error - ' + error);
    }
}

export function clearQueryParams() {
    const doNotRemove = ['siteRevision', 'branchId', 'stepOfCreation'];
    let state = {};
    if (query?.state)
        state = JSON.parse(query.state);
    const toRemove = [];
    for (const property in query) {
        if (!state[property]) {
            if (!doNotRemove.includes(property))
                toRemove.push(property);
        }
    }
    wixLocation.queryParams.remove(toRemove);
}

export const getTokenset = () => validateAccessToken();

function storeTokenAndUserInfo(tokenset, userInfo) {
    local.setItem('tokenset', JSON.stringify(tokenset));
    local.setItem('userInfo', JSON.stringify(userInfo));
}