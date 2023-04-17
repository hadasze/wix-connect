import * as initPage from 'public/Pages/Communication/init.js';

//
// for second ver:
// need to make sure to keep the multistate order. 
// the way to do it is to change to the first state when page load or keep the state in the params
// 


$w.onReady(function () {
    initPage.setEvents();
    initPage.setData();
});
