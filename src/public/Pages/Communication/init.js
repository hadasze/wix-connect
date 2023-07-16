import { autorun } from 'mobx';
import { state } from './state-management.js';
import { TIME } from 'public/consts.js';

import * as createEmailHandler from './create-email.js';
import * as addDetailsHandler from './add-details.js';
import * as testAndSendHandler from './test-and-send.js';
import * as previewHandler from './preview.js';
import * as topBarHandler from './top-bar.js';
import * as targetAudienceHandler from './Target-Audience/target-audience.js';
import * as validationsHandler from './validations.js';
import * as Fedops from '../../wix-fedops-api.js';

import { saveCommunication } from 'backend/data-methods-wrapper.jsw';



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
            Fedops.appLoadStarted();
            $autoSaveAnimation.show();
            await saveCommunication(state.communication);
            $autoSaveAnimation.hide();
            Fedops.appLoaded();
        } catch (err) {
            console.error('public/create-email save debounce ', err);
        }
    }, { delay: TIME.AUTO_SAVE });
}