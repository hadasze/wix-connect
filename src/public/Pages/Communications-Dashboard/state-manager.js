// @ts-ignore
import wixWindow from 'wix-window';

import { autorun, observable, configure, toJS } from 'mobx';


const routerData = wixWindow.getRouterData();


configure({
    useProxies: "never"
})

export const state = observable({
    communicationsCounts: routerData.count,
    communicationDetails: routerData.communicationDetails,
});