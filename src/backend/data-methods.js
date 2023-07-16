import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';
import { getJSON } from 'wix-fetch';
import { Communication } from './Communication.js';

import { v4 as uuidv4 } from 'uuid';

const dataOptions = { suppressAuth: true, consistentRead: true }

export function getCommunication(id) {
    return wixData.get('Communications', id, dataOptions);
}

export async function createCommunication() {
    try {
        const _id = uuidv4();
        const communication = new Communication(_id);
        const insertRes = await wixData.insert("Communications", communication, dataOptions);
        return insertRes;

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

export async function getAllUserCommunications(filters, options = {}, limit = 10, skip = 0) {
    //toDo: user retrive all items in case of more then 1000 communications
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

export async function getContactedEmailByMemberID(memberID) {
    try {
        const getRes = await wixData.get('Members/PrivateMembersData', memberID, dataOptions);
        if (getRes) return getRes.loginEmail;
    } catch (error) {
        return Promise.reject('backend -> data-methods.js -> getContactedEmailByMemberID failed - origin error - ' + error);
    }
}

export const countAllUserCommunications = async () => {
    const options = { count: true }
    const allCurrentUserCommunications = await getAllUserCommunications({}, {}, 1000, 0);
    // all, draft, archive, sent, templates
    const toReturn = [0, 0, 0, 0, 0];

    allCurrentUserCommunications.items.forEach(item => {
        if ((item.sent || item.draft) && !item.archive)
            toReturn[0]++;
        if ((item.draft) && !item.archive)
            toReturn[1]++;
        if (item.archive)
            toReturn[2]++;
        if ((item.sent) && !item.archive)
            toReturn[3]++;
        if (item.isTemplate)
            toReturn[4]++;
    });
    return toReturn;
}