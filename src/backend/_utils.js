import { v4 as uuidv4 } from 'uuid';

export function isEmpty(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

export function replaceID(array) {

    return array.map((item) => {
        const { _id, uuid, ...rest } = item;
        return { _id: uuidv4(), uuid: _id, ...rest };
    })
}

export function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export function uniqueArrayOfObjByKey(arrayOfObj, key) {
    return [...new Map(arrayOfObj.map(item => [item[key], item])).values()];
}