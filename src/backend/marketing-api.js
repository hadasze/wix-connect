import { fetch } from 'wix-fetch';
import * as EROAPI from './ero-api.js';
import { replaceID } from './_utils.js';

export async function getAudienceDetails(uuidsAndMsids, userJWT) {
    try {
        if (!uuidsAndMsids)
            throw new Error('audience is mandetory');
        if (!userJWT)
            throw new Error('userJWT is mandetory');
        const body = JSON.stringify({ UUIDs: uuidsAndMsids });
        const getPeopleDataUrl = EROAPI.ERO_BASE_URL.PROD + '/tools/getMarketingDataForUsers';

        const res = await fetch(getPeopleDataUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userJWT}`,
                'Content-Type': 'application/json',
            },
            body
        });

        if (res.ok) {
            const results = await res.json();
            return parseAudience(results.data.marketingData, uuidsAndMsids);
        }
        
        throw new Error(await res.text());

    } catch (error) {
        return Promise.reject('backend -> people-data-api.js -> getAudienceDetailsFromPeopleDataAPI failed - origin error - ' + error);
    }
}

function parseAudience(resultsFromPPLDataAPI, uuidsAndMsids) {
    const toReturn = [];
    for (let index = 0; index < uuidsAndMsids.length; index++) {
        const uuidsAndMsid = uuidsAndMsids[index];

        if (uuidsAndMsid.uuid && uuidsAndMsid.msid) {
            const filteredItems = resultsFromPPLDataAPI.filter((data) => {

                return data._id === uuidsAndMsid.uuid && data.msid === uuidsAndMsid.msid ||
                    data._id === uuidsAndMsid.uuid && data.data;
            })

            toReturn.push(filteredItems[0]);
        }

        if (uuidsAndMsid.uuid && !uuidsAndMsid.msid) {
            const filteredItems = resultsFromPPLDataAPI.filter((user) => user._id === uuidsAndMsid.uuid);
            toReturn.push(filteredItems[0]);
        }

    }

    return { data: { marketing: replaceID(toReturn) } };
}


export async function getSentCommunications(comuunicationIds, userJWT) {
    try {
        if (!comuunicationIds)
            throw new Error('comuunicationIds is mandetory');
        if (!userJWT)
            throw new Error('userJWT is mandetory');

        const getMarketingCampaignsDataUrl = EROAPI.ERO_BASE_URL.PROD + '/tools/getMarketingCampaignsData';

        const res = await fetch(getMarketingCampaignsDataUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userJWT}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "UUIDs": comuunicationIds })
        });

        if (res.ok)
            return await res.json();

        throw new Error(res.statusText);

    } catch (error) {
        return Promise.reject('backend -> data-methdos.js -> getSentCommunications failed - origin error - ' + error);
    }
}
