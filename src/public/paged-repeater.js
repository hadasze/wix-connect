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

export class ButtonInfo {
    constructor(text, state) {
        this.text = text;
        this.state = state;
    }
    static NORMAL = 'NORMAL';
    static SELECTED = 'SELECTED';
    static RANGE = 'RANGE';
}

export class PagedRepeater {
    constructor(filter, logger = null, options = null) {
        this.filter = filter;
        this.page = 0;
        this.logger = logger;
        this.options = options;
        this.activeData = [];
    }

    get data() {
        return this.repeater.data
    }

    setData(data) {
        if (!this.repeater) {
            throw new Error('paged-repeater -> repeater is not defined')
        }


        this.initRepeater(data);
    }

    setRepeater(repeater) {
        this.repeater = repeater;
    }

    getState() {
        return new PagedRepeaterState(this.numPages(), this.page);
    }

    getPageData(page) {

        return this.activeData.slice(page * this.options.page_size, (page + 1) * this.options.page_size);
    }

    setPageData(page) {
        this.repeater.data = [];

        //quick win to solve bug in viewr when the repeater isn't render

        setTimeout(() => {            
            const pageData = this.getPageData(page);
            this.repeater.data = pageData;
            this.page = page;
        }, 100);

    }

    numPages() {
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
        if (value) {
            for (let i = 0; i < this.allData.length; i++) {
                if (this.filter(this.allData[i], value)) {
                    this.activeData[pos++] = this.allData[i];
                }
            }
            this.activeData.length = pos;
        }
        else {
            this.activeData = this.allData;
        }
    }

    log(message) {
        if (this.logger != null) {
            this.logger.log(message);
        }
    }
    async initRepeater(data) {
        try {
            this.allData = data;
            this.setActiveData();
            this.setPageData(0);

            return true;
        } catch (error) {
            return false;
        }
    }

    setPaginator() {
        const pagination = this.getPagination(this.page, this.numPages());
        return pagination.map(value => {
            let state = ButtonInfo.NORMAL;
            if (this.page === (value - 1)) {
                state = ButtonInfo.SELECTED;
            }
            if (value === '...') {
                state = ButtonInfo.RANGE;
            }

            return new ButtonInfo(value.toString(), state);
        });
    }

    getPagination(currentPage, pageCount) {
        const getRange = (start, end) => {
            return Array(end - start + 1)
                .fill()
                .map((v, i) => i + start)
        }

        let delta;
        if (pageCount <= 7) {
            delta = 7
        } else {
            delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4
        }

        const range = {
            start: Math.round(currentPage - delta / 2) + 1,
            end: Math.round(currentPage + delta / 2) + 1
        }

        if (range.start - 1 === 1 || range.end + 1 === pageCount) {
            range.start += 1
            range.end += 1
        }

        let pages =
            currentPage > delta
                ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
                : getRange(1, Math.min(pageCount, delta + 1))

        const withDots = (value, pair) => (pages.length + 1 !== pageCount ? pair : [value])

        if (pages[0] !== 1) {
            pages = withDots(1, [1, '...']).concat(pages)
        }

        if (pages[pages.length - 1] < pageCount) {
            pages = pages.concat(withDots(pageCount, ['...', pageCount]))
        }

        return pages;
    }
}