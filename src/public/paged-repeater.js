export class PagedRepeaterOptions {
    constructor(page_size) {
        this.page_size = page_size;
    }
}

export class PagedRepeaterState {
    constructor(numPages, page) {
        this.numPages = numPages;
        this.currPage = page;
    }
}

export class PagedRepeater {
    constructor(repeater, getData, filter, onItemReady, logger = null, options = null) {
        this.repeater = repeater;
        this.getData = getData;
        this.filter = filter;
        this.page = 0;
        this.onItemReady = onItemReady
        this.logger = logger;
        this.options = options;
        this.activeData = [];
    }

    get data() {
        return this.repeater.data
    }

    async setData(data) {
        this.repeater.data = data;
        await this.initRepeater();
    }

    getState() {
        return new PagedRepeaterState(this.numPages(), this.page);
    }

    getPageData(page) {
        // use pagination NPM?
        return this.activeData.slice(page * this.options.page_size, (page + 1)  * this.options.page_size);
    }

    setPageData(page) {
        const pageData = this.getPageData(page);
        console.log(pageData);
        this.repeater.data = pageData;
        this.page = page;
    }

    numPages() {
        console.log("numPages: ", this.activeData.length)
        return Math.ceil(this.activeData.length / this.options.page_size);
    }

    next() {
        const numPages = this.numPages();
        if (this.page >= numPages - 1) {
            return;
        }
        this.page++;
        this.setPageData(this.page);
    }

    prev() {
        if (this.page <= 0) {
            return false;
        }
        this.page--;
        this.setPageData(this.page);
        return this.page > 0;
    }

    goto(page) {
        this.page = page;
        this.setPageData(this.page);
        return;
    }

    search(value) {
        this.setActiveData(value);
        this.setPageData(0);
    }

    setActiveData(value) {
        let pos = 0;
        for (let i = 0 ; i < this.allData.length ; i++) {
            if (this.filter(this.allData[i], value)) {
                this.activeData[pos++] = this.allData[i];
            }
        }
        this.activeData.length = pos;
        console.log(this.activeData.length);
    }

    log(message) {
        if (this.logger != null) {
            this.logger.log(message);
        }
    }
    async initRepeater() {
        this.repeater.data = [];
        try {
            this.allData = await this.getData();
            this.setActiveData('');
            this.setPageData(0);
            return true;
        } catch (error) {
            return false;
        }
        return true;
    }
}