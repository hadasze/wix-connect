import * as EROAPI from './ero-api.js';
import { fetch } from 'wix-fetch';

export const templates = {
    defaultTemplate: 'blast_marketing_templates_em-marketing-tool-template-1_25122022_en'
}

export async function sendEmailToWixUsers(uuid, body, userJWT) {
    try {

        if (!uuid)
            throw new Error('uuid is mandetory');
        if (!userJWT)
            throw new Error('userJWT is mandetory');
        if (!body)
            throw new Error('body is mandetory');

        const sendEmailToWixUserUrl = EROAPI.ERO_BASE_URL.PROD + '/wix-rpc/BoSendEmailToWixUser?userId=';

        const res = await fetch(sendEmailToWixUserUrl + uuid, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userJWT}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        
        if (res.ok) {
            return await res.json();
        }
        throw new Error(await res.text());

    } catch (error) {
        return Promise.reject('backend -> user-mailer-api.js -> sendEmailToWixUsers failed - origin error - ' + error);
    }
}