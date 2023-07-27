import * as communicationsDashboardHandler from './communications-dashboard.js'
import * as topBarHandler from './top-bar.js'
import * as templatesDashboardHandler from './templates-dashboard.js'

export function setEvents() {
    topBarHandler.initTopBardActions();
    communicationsDashboardHandler.setEmptyState();
}

export function setData() {
    communicationsDashboardHandler.initCommunicationsDashboardData();
    templatesDashboardHandler.initTemplatesDashboardData();
}