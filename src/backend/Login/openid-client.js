import { getSecret } from 'wix-secrets-backend';
import { getUuidByEmail } from 'backend/data-methods-wrapper.jsw';
import { Issuer } from 'openid-client';

const IDPConfig = {
    "discovery_uri": "https://sso.wewix.net/auth/realms/WIX-APP/.well-known/openid-configuration",
    "response_type": "code",
    "scope": "profile+openid",
    "client_id": "ero-wix-connect",
    "client_secret_manager_key": "IDP_APP_SECRET_KEY",
    "server_secret_manager_key": "IDP_SERVER_TO_SERVER_SECRET_KEY",
    'defaultRedirectURI': "https://wix-connect.com"
}

const client_secretPromise = getSecret(IDPConfig.client_secret_manager_key);
const wixIssuerPromise = Issuer.discover(IDPConfig.discovery_uri);

export async function getClient(redirectURI) {
    try {
        const wixIssuer = await wixIssuerPromise;
        return new wixIssuer.Client({
            client_id: IDPConfig.client_id,
            client_secret: await client_secretPromise,
            redirect_uris: [redirectURI || IDPConfig.defaultRedirectURI],
            response_types: [IDPConfig.response_type]
        });
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> getClient failed - origin error - ' + error);
    }
}

export async function getAuthorizationEndpoint(redirectURI) {
    try {
        if (!redirectURI) {
            throw new Error('Missing redirectURI');
        }
        const [client, wixIssuer] = await Promise.all([getClient(redirectURI), wixIssuerPromise]);
        const authorization_endpoint = client.authorizationUrl({
            scope: IDPConfig.scope,
            resource: wixIssuer.resource_registration_endpoint,
        });
        return decodeURIComponent(authorization_endpoint);
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> getAuthorizationEndpoint failed - origin error - ' + error);
    }
}

export async function getTokenSet(redirectURI, fullUrl) {
    try {
        if (!fullUrl) {
            throw new Error('Missing fullUrl');
        }
        if (!redirectURI) {
            throw new Error('Missing redirectURI');
        }
        const client = await getClient(redirectURI);
        const params = client.callbackParams(fullUrl);
        return await client.callback(redirectURI, params, {});
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> getTokenSet failed - origin error - ' + error);
    }
}

export async function getUserinfo(accessToken, client) {
    try {
        if (!accessToken) {
            throw new Error('Missing accessToken');
        }
        if (!client) client = await getClient();
        const userInfo = await client.userinfo(accessToken);
        const uuid = await getUuidByEmail(userInfo.email);
        return { ...userInfo, uuid }
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> getUserinfo failed - origin error - ' + error);
    }
}

export async function introspect(token) {
    try {
        if (!token) {
            throw new Error('Missing token');
        }
        const client = await getClient();
        return client.introspect(token);
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> introspect failed - origin error - ' + error);
    }
}

export async function refreshToken(refreshToken) {
    try {
        if (!refreshToken) {
            throw new Error('Missing refreshToken');
        }
        const client = await getClient();
        return client.refresh(refreshToken);
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> refreshToken failed - origin error - ' + error);
    }
}

export async function getLogoutURI() {
    try {
        const client = await getClient();
        return client.endSessionUrl();
    } catch (error) {
        return Promise.reject('backend/Login/openid-client.js -> getLogoutURI failed - origin error - ' + error);
    }
}