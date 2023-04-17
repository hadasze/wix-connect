import { AllLoginBottomButtons, LoginPageImages } from 'public/consts.js'
import { disbaleCurrentButton } from 'public/Pages/helpers.js';
import { sendBi } from 'public/BI/biModule.js';
import * as openID from '../login.js';
import wixLocation from 'wix-location';

openID.login() ||
    $w.onReady(function () {
        $w('#loginButton').onClick(async (event) => {
            sendBi('userLogin', {})
            wixLocation.to(await openID.authorizationEndpoint);
        })
        $w('#loginButton').enable();
        $w('#loginButton').expand();
        $w('#loginAnimation, #loadingText').collapse();
        disbaleCurrentButton('analyzeAudienceButton', AllLoginBottomButtons);
        setEvents();
    });

function setEvents() {

    $w('#analyzeAudienceButton').onClick(() => {
        $w('#loginPageImg').src = LoginPageImages.analyzeAudience;
        disbaleCurrentButton('analyzeAudienceButton', AllLoginBottomButtons);
    });

    $w('#sendEmailsButton').onClick(() => {
        $w('#loginPageImg').src = LoginPageImages.sendEmails;
        disbaleCurrentButton('sendEmailsButton', AllLoginBottomButtons);
    });

    $w('#getDeliverabilityButton').onClick(() => {
        $w('#loginPageImg').src = LoginPageImages.getDeliverability;
        disbaleCurrentButton('getDeliverabilityButton', AllLoginBottomButtons);
    });

    $w('#useOneToolButton').onClick(() => {
        $w('#loginPageImg').src = LoginPageImages.useOneToolButton;
        disbaleCurrentButton('useOneToolButton', AllLoginBottomButtons);
    });
}