import Cache from 'node-cache';

class CacheHelper {
    constructor() {
        this.cache = null;
    }
    init() {
        this.cache = new Cache({ stdTTL: 0, checkperiod: 600 });
    }
    getKey(key) {
        return this.cache.get(key);
    }
    setKey(key, value) {
        this.cache.set(key, value);
    }
}

const cache = new CacheHelper();
cache.init();

export default cache