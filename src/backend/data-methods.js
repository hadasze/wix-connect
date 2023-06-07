import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';
import { fetch, getJSON } from 'wix-fetch';
import { Communication } from './Communication.js'
import * as EROAPI from './ero-api.js';

import { v4 as uuidv4 } from 'uuid';

const dataOptions = { suppressAuth: true }

export function getCommunication(id) {
    return wixData.get('Communications', id, dataOptions);
}

export async function createCommunication() {
    try {
        const _id = uuidv4();
        const communication = new Communication(_id);
        const insertRes = await wixData.insert("Communications", communication, dataOptions);
        //Quick win -> need to investigate further
        return new Promise(resolve => setTimeout(resolve, 300, insertRes));

    } catch (error) {
        return Promise.reject('backend -> data-methdos.js -> createCommunication failed - origin error - ' + error);
    }
}

export async function removeCommunication(communicationId) {
    return wixData.remove("Communications", communicationId, dataOptions)
}

export function saveCommunication(communication = {}) {
    return wixData.save("Communications", communication, dataOptions);
}

export async function getTargetAudience(id) {
    const communication = await wixData.get('Communications', id, dataOptions);
    return communication.targetAudience;
}

export const insertToSentUsers = (userId) => wixData.insert('SentUsers', { _id: userId }, dataOptions)

export async function getAllUserCommunications(filters, options = {}, limit = 10, skip = 0) {
    let query = wixData.query('Communications').eq('_owner', wixUsersBackend.currentUser.id).skip(limit * skip).limit(limit);
    if (filters.draft && filters.sent) {
        query = query.eq('draft', filters.draft).or(query.eq('sent', filters.sent)).and(query.ne('archive', true));
    } else {
        if (filters.archive)
            query = query.eq('archive', filters.archive);
        if (filters.draft)
            query = query.eq('draft', filters.draft).and(query.ne('archive', true));
        if (filters.sent)
            query = query.eq('sent', filters.sent).and(query.ne('archive', true));
        if (filters.isTemplate)
            query = query.eq('isTemplate', filters.isTemplate);
    }
    if (options?.count)
        return query.count(dataOptions);
    return query.find(dataOptions);
}

export function updateCommunication(communication) {
    return wixData.update("Communications", communication, dataOptions);
}

export async function getUuidByEmail(email) {
    const uuid = (await getJSON('https://users.wix.com/_api/v1/userAccountsByEmail?email=' + email)).accountsData[0].accountId;
    return uuid;
}

export async function getSentCommunicationData(userID, userJWT) {
    try {
        if (!userID)
            throw new Error('userID is mandetory');
        if (!userJWT)
            throw new Error('userJWT is mandetory');

        const getMarketingCampaignsDataUrl = EROAPI.ERO_BASE_URL.PROD + '/tools/getMarketingCampaignsData';

        const res = await fetch(getMarketingCampaignsDataUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userJWT}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "uuid": userID })
        });

        if (res.ok)
            return await res.json();

        throw new Error(res.statusText);

    } catch (error) {
        return Promise.reject('backend -> data-methdos.js -> getSentCommunicationData failed - origin error - ' + error);
    }
}

export async function clearOldSentUsers() {
    try {
        const currentDate = new Date();
        const numberOfDaysToRemove = 2;
        const dateBeforeTwoDays = new Date(currentDate.setDate(currentDate.getDate() - numberOfDaysToRemove));
        const queryRes = await wixData.query('SentUsers').lt('_createdDate', dateBeforeTwoDays).find(dataOptions);
        const itemsToRemove = queryRes.items.map((item) => item._id);

        if (itemsToRemove.length > 0)
            return wixData.bulkRemove('SentUsers', itemsToRemove, dataOptions);
        return

    } catch (error) {
        return Promise.reject('backend -> data-methods.js -> clearOldSentUsers failed - origin error - ' + error);
    }
}

export async function getContactedEmailByMemberID(memberID) {
    try {
        const getRes = await wixData.get('Members/PrivateMembersData', memberID, dataOptions);
        if (getRes) return getRes.loginEmail;
    } catch (error) {
        return Promise.reject('backend -> data-methods.js -> getContactedEmailByMemberID failed - origin error - ' + error);
    }
}