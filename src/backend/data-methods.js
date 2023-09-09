import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';
import { getJSON } from 'wix-fetch';
import { Communication } from './Communication.js';
import * as Constants from './constants.js';
import * as Utils from './_utils.js';

import { v4 as uuidv4 } from 'uuid';

const dataOptions = { suppressAuth: true, consistentRead: true };
const defaultLimit = 1000;

export function getCommunication(id) {
    return wixData.get('Communications', id, dataOptions);
}

export async function createCommunication(origin) {
    try {
        const _id = uuidv4();
        const communication = new Communication(_id, origin);
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
    let query = wixData.query('Communications').eq('_owner', wixUsersBackend.currentUser.id).ne('delete', true).skip(limit * skip).limit(limit);
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
    if (options?.all)
        return await retriveAllItems(query, defaultLimit);
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

export async function duplicateCommunication(communicationID) {
    const getRes = await wixData.get('Communications', communicationID, dataOptions);
    const { _id, _owner, _createdDate, _updatedDate, ...rest } = getRes;
    const insertRes = await wixData.insert('Communications', rest, dataOptions);
    return insertRes;
}

export async function getAllRecentlySentUsers(filters) {
    let query = wixData.query(Constants.Collections.SentUsers);
    if (filters?.date?.lt) {
        query = query.lt('_createdDate', filters.date.lt);
    }

    return await retriveAllItems(query, defaultLimit);
}

export async function clearSentUsers() {
    const currentDate = new Date();
    const dateBeforeXDays = currentDate.setDate(currentDate.getDate() - Constants.DELETE_SENT_USERS_AFTER_X_DAYS);

    const filters = {
        date: {
            lt: new Date(dateBeforeXDays)
        }
    }
    const allRecentlySentUsers = await getAllRecentlySentUsers(filters);

    const toDelete = allRecentlySentUsers.map(item => item._id);
    if (toDelete.length > 0) {

        const chunks = Utils.chunkArray(toDelete, defaultLimit);
        const promises = chunks.map(chunk => bulkRemoveSentUsers(chunk));
        return await Promise.all(promises);
    }

    return;
}

export const bulkRemoveSentUsers = (array) => wixData.bulkRemove(Constants.Collections.SentUsers, array);

export async function addUsersToSentList(array) {
    const chunks = Utils.chunkArray(array, defaultLimit);
    const promises = chunks.map(chunk => wixData.bulkInsert(Constants.Collections.SentUsers, chunk, dataOptions));
    return await Promise.all(promises);
}

async function retriveAllItems(query, limit) {

    const queryRes = await query.limit(limit).find(dataOptions);

    const queryPromise = [];
    for (let index = 1; index < queryRes.totalPages; index++)
        queryPromise.push(query.skip(limit * index).limit(limit).find(dataOptions));
    const queryPromiseRes = await Promise.all(queryPromise);

    const allItems = queryPromiseRes.map(queryRes => queryRes.items)
    return [...queryRes.items, ...allItems].flat();
}