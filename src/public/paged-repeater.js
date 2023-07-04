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
        return this.activeData.slice(page * this.options.page_size, (page + 1) * this.options.page_size);
    }

    setPageData(page) {
        const pageData = this.getPageData(page);
        console.log({ pageData });
        this.repeater.data = pageData;
        this.page = page;
    }

    numPages() {
        //console.log("numPages: ", this.activeData.length)
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


        console.log('this.activeData: ', this.activeData);
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
            this.setActiveData();
            this.setPageData(0);

            return true;
        } catch (error) {
            return false;
        }
        return true;
    }

    getButtonState(index, numButtons) {
        if (index == this.page) {
            return ButtonInfo.SELECTED;
        } else if ((index == 1) && (numButtons < this.numPages()) && (this.page > numButtons / 2)) {
            return ButtonInfo.RANGE;
        } else if ((index == numButtons - 2) && (numButtons < this.numPages()) && (this.page < numButtons / 2)) {
            return ButtonInfo.RANGE;
        }
        return ButtonInfo.NORMAL;
    }

    getButtonText(index, buttonState, numButtons) {
        const numPages = this.numPages();
        if (numButtons == numPages) {
            return (index + 1).toString();
        }
        let result = 0;
        // first page
        if (index == 0) {
            result = 1;
            // second page - check buttonState != ButtonInfo.RANGE
        } else if ((index == 1) && (buttonState != ButtonInfo.RANGE)) {
            result = 2;
            // second from the last - check buttonState != ButtonInfo.RANGE
        } else if ((index == numButtons - 2) && (buttonState != ButtonInfo.RANGE)) {
            result = numPages - 1;
            // last page
        } else if (index == numButtons - 1) {
            result = numPages;
            // in between 
        } else {
            const midButton = Math.ceil(numButtons / 2);
            // [1,2,3,4,5,...,43]
            // [1,...,49,50,51,...,43]
            const val = index + 1;
            if (this.page <= midButton) {
                console.log(`this page ${this.page} <= ${midButton}`);
                result = val;
                // if (index <= midButton) {
                //     result = index + 1;
                // } else {
                //     result = 99;
                // }
            }
            else if (this.page > midButton) {
                result = numPages - 1;

            }
            else {
                const offset = index - midButton;
                result = this.page + offset;
            }

        }
        return result.toString();
    }

    getButtonInfo(index, numButtons) {
        const buttonState = this.getButtonState(index, numButtons);
        const buttonText = this.getButtonText(index, buttonState, numButtons);
        console.log({ index, buttonState, numButtons, buttonText });
        return new ButtonInfo(buttonText, buttonState);
    }

    getPaginationOld(numButtons) {
        const len = Math.min(numButtons, this.numPages());
        const result = new Array(len);

        for (let i = 0; i < len; i++) {
            result[i] = this.getButtonInfo(i, numButtons);
            //console.log(`Selected page ${i}:`, this.getPaginatioNew(i, numButtons));
        }
        return result;
    }

    setPaginator(numButtons) {
        const pagination = this.getPagination(this.page, this.numPages());
        return pagination.map((value, index) => {
            let state = ButtonInfo.NORMAL;
            if (this.page === index) {
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
            start: Math.round(currentPage - delta / 2),
            end: Math.round(currentPage + delta / 2)
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
        
        console.log({currentPage, pageCount, pages});
        return pages;
    }
}