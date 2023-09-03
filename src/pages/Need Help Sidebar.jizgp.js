import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    $w('#getStartedBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'buttonName': 'get_started' })
    });
    $w('#seeGuidelinesBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'buttonName': 'see_the_guidelines' })
    });
    $w('#learnMoreBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'buttonName': 'learn_more' })
    });
    $w('#downloadCsvTemplateBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'buttonName': 'download_csv_template' })
    });
    $w('#askOnSlackBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'buttonName': 'ask_on_slack_channel' })
    });
});