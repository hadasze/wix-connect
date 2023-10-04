import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';
import cache from './cache';

const ERO_S2S_SECRET = 'ERO_S2S_SECRET';
const ERO_S2S_CLIENT = 'ERO_S2S_CLIENT';
const ERO_QA_SECRET = 'ERO_QA_SECRET';
const ERO_QA_CLIENT = 'ERO_QA_CLIENT';
const ERO_WIXAPP_TOKEN_ENDPOINT = 'https://sso.wewix.net/auth/realms/WIX-APP/protocol/openid-connect/token';

export const ERO_BASE_URL = {
    PROD: 'https://ero.wewix.net/keycloak',
    STAGE: 'https://ero-stage.wewix.net/keycloak',
}

export async function getServerToken(isQA) {
    try {

        let S2S_Token = cache.getKey('S2S_Token');
       
        if (S2S_Token)
            return S2S_Token;

        let client = cache.getKey('ERO_S2S_CLIENT');
        let secret = cache.getKey('ERO_S2S_SECRET');

        if (isQA || !client || !secret)
            [client, secret] = await Promise.all([
                getSecret(isQA ? ERO_QA_CLIENT : ERO_S2S_CLIENT),
                getSecret(isQA ? ERO_QA_SECRET : ERO_S2S_SECRET),
            ]);

        cache.setKey('ERO_S2S_CLIENT', client);
        cache.setKey('ERO_S2S_CLIENT', secret);

        const response = await fetch(ERO_WIXAPP_TOKEN_ENDPOINT, {
            method: 'post',
            headers: {
                'authorization': basicAuth(client, secret),
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        })
        if (!response.ok) throw new Error(response.statusText);
        S2S_Token = await response.json();
        cache.setKey('S2S_Token', S2S_Token);

        return S2S_Token;

    } catch (error) {
        console.error('ero-api.js -> getServerToken failed - origin error - ' + error);
        return Promise.reject('ero-api.js -> getServerToken failed - origin error - ' + error);
    }

}

function basicAuth(client, secret) {
    return `Basic ${Buffer.from(`${client}:${secret}`, 'binary').toString('base64')}`;
}

export async function wixConnectAddOrRemoveScope(email, add) {
    try {
        if (!email)
            throw new Error('email is mandetory field');
        //ToDo: validate email
        const url = ERO_BASE_URL.PROD + (add ? '/tools/WixConnectAddScope?email=' : '/tools/WixConnectRemoveScope?email=');
        const jwtPayload = await getServerToken();

        const response = await fetch(url + email, {
            method: 'POST',
            headers: {
                'Authorization': `${jwtPayload.token_type} ${jwtPayload.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        if (!response.ok) throw new Error(await response.text());
        return await response.json();

    } catch (error) {
        return Promise.reject('ero-api.js -> wixConnectAddOrRemoveScope failed - origin error - ' + error + ' ' + JSON.stringify({ email, add }));
    }
}