import { badRequest, forbidden, created, ok } from 'wix-http-functions';
import * as EROAPI from './ero-api.js';
import { getSecret } from 'wix-secrets-backend';
import { WixSmartConectCourseid, SmartSecret, QASecret } from 'public/consts';
import { isEmpty } from './_utils';

export async function post_courseCompleted(request) {

    const bodyJSON = await request.body.json();
    const options = {
        "headers": {
            "Content-Type": "application/json"
        }
    };

    if (request?.headers?.authorization === await getSecret(SmartSecret)) {
        if (isEmpty(bodyJSON)) {
            options.body = {
                "error": "The request must contain non-empty body."
            }
            return badRequest(options);
        }

        if (bodyJSON.courseid === WixSmartConectCourseid && bodyJSON.useremail) {
            const addPermissionRes = await EROAPI.wixConnectAddOrRemoveScope(bodyJSON.useremail, true);
        }
        return created(options);
    }

    options.body = {
        "error": "invalid token"
    }

    return forbidden(options);
}

export async function post_generateQAtoken(request) {

    const options = {
        "headers": {
            "Content-Type": "application/json"
        }
    };

    if (request?.headers?.authorization === await getSecret(QASecret)) {
        const isQA = true;
        const tokenSet = await EROAPI.getServerToken(isQA);
        options.body = {
            access_token: tokenSet.access_token
        }
        return ok(options);
    }

    options.body = {
        "error": "invalid token"
    }

    return forbidden(options);
}