import { mediaManager } from 'wix-media-backend';
import { csv } from 'csvtojson';
import request from 'request-promise-node';

export async function updateTargetAudience(item) {
    try {
        if (shouldUpadteAudienceCSV(item)) {
            try {
                const publicUrl = await getPublicFileUrl(item.targetAudienceCsv);
                item.targetAudience = await convertUrlToCsvData(publicUrl);
            } catch (error) {
                console.error('backend/data-hooks-helpers/target-audience-hooks-helper.js -> updateTargetAudience -> shouldUpadteAudienceCSV failed - origin error - ' + error)
            }
            // const channel = { "name": item._id };
            // wixRealtimeBackend.publish(channel, "done upload");
        }
        return item
    } catch (error) {
        console.error('updateTargetAudience failed - error ', error);
    }
}

const shouldUpadteAudienceCSV = (item) => item.targetAudienceCsv && !item.targetAudience

async function convertUrlToCsvData(url) {
    try {
        const reqRes = await request(url);
        const body = reqRes.body;
        const csvRes = await csv().fromString(body)
        return csvRes
    } catch (error) {
        return Promise.reject('backend/data-hooks-helpers/target-audience-hooks-helper.js -> convertUrlToCsvData failed - origin error - ' + error);
    }
}

async function getPublicFileUrl(url) {
    try {
        return await mediaManager.getDownloadUrl(url);
    } catch (error) {
        return Promise.reject('backend/data-hooks-helpers/target-audience-hooks-helper.js -> getPublicFileUrl failed - origin error - ' + error);
    }
}