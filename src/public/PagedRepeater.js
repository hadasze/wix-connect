const PagedRepeaterConsts = {
    PAGE_SIZE: 10,
}

export class PagedRepeater {
    constructor(repeater, getData, filter, onItemReady) {
        this.repeater = repeater;
        this.getData = getData;
        this.filter = filter;
        this.page = 0;
        this.itemReady = onItemReady
        this.activeData = [];
    }

    get data() {
        return this.repeater.data
    }

    set data(data) {
        this.repeater.data = data;
    }

    getPageData(page) {
        return this.activeData.slice(page * PagedRepeaterConsts.PAGE_SIZE, (page + 1) * PagedRepeaterConsts.PAGE_SIZE);
    }

    setPageData(page) {
        const pageData = this.getPageData(page);
        this.repeater.data = pageData;
        this.page = page;
    }

    next() {
        const numPages = Math.ceil(this.activeData.length / PagedRepeaterConsts.PAGE_SIZE);
        if (this.page >= numPages - 1) {
            console.log("OOPS, page = ", this.page, " num pages = ", numPages);
            return;
        }
        this.page++;
        this.setPageData(this.page);
    }

    prev() {
        if (this.page <= 0) {
            console.log("OOPS");
            return false;
        }
        this.page--;
        this.setPageData(this.page);
        return this.page > 0;
    }

    search(value) {
        this.setActiveData(value);
        this.setPageData(0);
    }

    setActiveData(filter) {
        let pos = 0;
        for (let i = 0 ; i < this.allData.length ; i++) {
            const value = this.allData[i][filter.column];

            if (this.filter(value, filter)) {
                this.activeData[pos++] = this.allData[i];
            }
        }
        this.activeData.length = pos;
    }

    async initRepeater(val) {
        this.repeater.data = [];
        this.allData = await this.getData();
        this.setActiveData(val);
        this.setPageData(0);
    }
}