// @ts-ignore
import wixWindow from 'wix-window';

import {  observable, configure } from 'mobx';


const routerData = wixWindow.getRouterData();


configure({
    useProxies: "never"
})

export const state = observable({
    communications: routerData.communications,
    communicationDetails: routerData.communicationDetails,
});