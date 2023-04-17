import * as communicationsDashboardHandler from 'public/Pages/Communications-Dashboard/communications-dashboard.js'
import * as topBarHandler from 'public/Pages/Communications-Dashboard/top-bar.js'
import * as templatesDashboardHandler from 'public/Pages/Communications-Dashboard/templates-dashboard.js'

export function setEvents() {
    topBarHandler.initTopBardActions();
}

export function setData() {
    communicationsDashboardHandler.initCommunicationsDashboardData();
    templatesDashboardHandler.initTemplatesDashboardData();
}