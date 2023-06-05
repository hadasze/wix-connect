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
        return this.activeData.slice(page * this.options.page_size, (page + 1)  * this.options.page_size);
    }

    setPageData(page) {
        const pageData = this.getPageData(page);
        console.log(pageData);
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

    getButtonState(index, numButtons) {
        if (index == this.page) {
            return ButtonInfo.SELECTED;
        } else if ((index == 1) && (numButtons < this.numPages()) && (this.page > numButtons/2)) {
            return ButtonInfo.RANGE;
        }  else if ((index == numButtons - 2) && (numButtons < this.numPages()) && (this.page < numButtons / 2)) {
            return ButtonInfo.RANGE;
        }
        return ButtonInfo.NORMAL;
    }

    getButtonText(index, buttonState, numButtons) {
        if (numButtons == this.numPages()) {
            return (index + 1).toString();
        }
        let result = 0;
        if (index == 0) {
            result = 1;
        } else if ((index == 1) && (buttonState != ButtonInfo.RANGE)) {
            result = 2;
        }  else if ((index == numButtons - 2) && (buttonState != ButtonInfo.RANGE)) {
            result = this.numPages() - 1;
        } else if (index == numButtons - 1) {
            result = this.numPages();
        } else {
            const midButton = (numButtons + 1) / 2;
            if (this.page <= midButton) {
                if (index <= midButton) {
                    result = index + 1;
                } else {
                    result = 99;
                }
            } else {
                result = -1;
            }
            //const offset = index - midButton;

            //result = this.page + offset;
        }
        return result.toString();
    }

    getButtonInfo(index, numButtons) {
        const buttonState = this.getButtonState(index, numButtons);
        const buttonText = this.getButtonText(index, buttonState, numButtons);

        return new ButtonInfo(buttonText, buttonState);
    }

    getPagination(numButtons) {
        const len = Math.min(numButtons, this.numPages());
        const result = new Array(len);

        for (let i = 0 ; i < numButtons ; i++) {
            result[i] = this.getButtonInfo(i, numButtons);
        }
        return result;
    }

    getPaginatioNew(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    }
}