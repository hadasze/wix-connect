import { sendBi } from 'public/BI/biModule.js';

$w.onReady(function () {
    $w('#getStartedBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'button_name': 'get_started' })
    });
    $w('#seeGuidelinesBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'button_name': 'see_the_guidelines' })
    });
    $w('#learnMoreBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'button_name': 'learn_more' })
    });
    $w('#downloadCsvTemplateBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'button_name': 'download_csv_template' })
    });
    $w('#askOnSlackBtn').onClick((event) => {
        sendBi('needHelpSidebar', { 'button_name': 'ask_on_slack_channel' })
    });
});