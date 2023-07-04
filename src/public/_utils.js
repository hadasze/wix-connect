export function lowerize(obj) {
    return Object.keys(obj).reduce((acc, k) => {
        acc[k.toLowerCase()] = obj[k];
        return acc;
    }, {});
}

export const isArray = (obj) => Array.isArray(obj);


export function isUUID(str) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(str);
}