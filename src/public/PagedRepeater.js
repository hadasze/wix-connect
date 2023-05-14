const PagedRepeaterConsts = {
    PAGE_SIZE: 10,
}

export class PagedRepeater {
    constructor(repeater, getData, filters, onItemReady) {
        this.repeater = repeater;
        this.getData = getData;
        this.finishLoad = false;
        this.filters = filters;
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
        console.log("PD = ", JSON.stringify(pageData));
        this.repeater.data = pageData;
        this.page = page;
    }

    next() {
        console.log("PagedRepeater::Next");
        const numPages = Math.ceil(this.activeData.length / PagedRepeaterConsts.PAGE_SIZE);
        if (this.page >= numPages - 1) {
            console.log("OOPS, page = ", this.page, " num pages = ", numPages);
            return;
        }
        console.log("NumItems: ", this.activeData.length, " num pages: ", numPages);
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
        console.log("Searching: ", value);
        this.setActiveData(value);
        this.setPageData(0);
    }

    setActiveData(val) {
        var pos = 0;
        for (var i = 0 ; i < this.allData.length ; i++) {
            if (true) {// (this.allData[i].language.includes(val)) {
                this.activeData[pos++] = this.allData[i];
            }
        }
        this.activeData.length = pos;
        console.log("ActiveData Length: ", this.activeData.length);
    }

    async initRepeater(val) {
        console.log("Init: <", val, ">");
        // initData(val);
        this.repeater.data = [];
        // this.repeater.onItemReady(($item, itemData, index) => this.itemReady($item, itemData, index))
        this.allData = await this.getData();
        this.setActiveData(val);
        this.setPageData(0);
    }
}