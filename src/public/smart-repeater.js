import { SmartRepeaterConsts } from './consts.js'
export class SmartRepeater {

    constructor(repeater, container, getData, filters, onItemReady) {
        this.repeater = repeater;
        this.getData = getData;
        this.defaultLimit = SmartRepeaterConsts.DEFAULT_LIMIT;
        this.startLoadingNext = SmartRepeaterConsts.START_LOAD_NEXT;
        this.skip = SmartRepeaterConsts.SKIP;
        this.finishLoad = false;
        this.container = container;
        this.filters = filters;
        this.loadMoreData = async () => {
            if (!this.finishLoad) {
                try {
                    const options = {};
                    const moreData = await this.getData(this.filters, options, this.defaultLimit, this.skip);
                    if (!moreData)
                        console.warn('no more data!');
                    const currData = this.repeater.data;
                    this.repeater.data = currData.concat(moreData?.items || []);
                    this.skip++;
                    if (moreData?.items?.length < this.defaultLimit) {
                        this.finishLoad = true;
                    }
                } catch (err) {
                    console.error('loadMoreData failed - origin error = ' + err.message);
                }
            }
        };
        this.itemReady = onItemReady
    }

    get data() {
        return this.repeater.data
    }

    set data(data) {
        this.repeater.data = data;
    }

    initRepeater() {
        this.repeater.data = [];
        this.repeater.onItemReady(($item, itemData, index) => this.itemReady($item, itemData, index))
        this.container.onViewportEnter((event) => {
            this.repeater.forItems([event.context.itemId], ($item, itemData, index) => {
                if (index % this.startLoadingNext === 0 && this.repeater.data.length <= index + this.startLoadingNext) {
                    this.loadMoreData();
                }
            });
        })
        this.loadMoreData();
    }

    async resetRepeater() {
        this.finishLoad = false;
        this.skip = SmartRepeaterConsts.SKIP;
        this.repeater.data = [];
        await this.loadMoreData();
    }

}