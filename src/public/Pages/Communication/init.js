import { autorun } from 'mobx';
import * as createEmailHandler from 'public/Pages/Communication/create-email.js';
import * as addDetailsHandler from 'public/Pages/Communication/add-details.js';
import * as testAndSendHandler from 'public/Pages/Communication/test-and-send.js';
import * as previewHandler from 'public/Pages/Communication/preview.js';
import * as topBarHandler from 'public/Pages/Communication/top-bar.js';
import * as targetAudienceHandler from 'public/Pages/Communication/Target-Audience/target-audience.js';
import * as validationsHandler from 'public/Pages/Communication/validations.js';
import { state } from 'public/Pages/Communication/state-management.js';
import { saveCommunication } from 'backend/data-methods-wrapper.jsw';
import { TIME } from 'public/consts.js';
import { create } from 'wix-fedops';

const fedopsLogger = create('wix-connect');

export function setEvents() {
    topBarHandler.initTopBarActions();
    createEmailHandler.initCreateEmailActions();
    addDetailsHandler.initAddDetailsActions();
    testAndSendHandler.initTestAndSendActions();
    previewHandler.initPreviewActions();
    targetAudienceHandler.initTargetAudienceActions();
    validationsHandler.initValidations();
    handleAutoSave();
}

export function setData() {
    topBarHandler.initTestAndSendData();
    createEmailHandler.initCreateEmailData();
    addDetailsHandler.initAddDetailsData();
    testAndSendHandler.initTestAndSendData();
    targetAudienceHandler.initTargetAudienceData();
}

const handleAutoSave = () => {
    autorun(async () => {
        try {
            const $autoSaveAnimation = $w('#autoSaveAnimation');
            fedopsLogger.appLoadStarted();
            $autoSaveAnimation.show();
            await saveCommunication(state.communication);
            $autoSaveAnimation.hide();
            fedopsLogger.appLoaded();
        } catch (err) {
            console.error('public/create-email save debounce ', err);
        }
    }, { delay: TIME.AUTO_SAVE });
}