import { autorun, reaction } from 'mobx';
import { state } from './state-management.js';
import { TIME } from 'public/consts.js';
import { CommunicationPage } from '../../components.js';

import * as createEmailHandler from './create-email.js';
import * as addDetailsHandler from './add-details.js';
import * as testAndSendHandler from './test-and-send.js';
import * as previewHandler from './preview.js';
import * as topBarHandler from './top-bar.js';
import * as targetAudienceHandler from './Target-Audience/target-audience.js';
import * as validationsHandler from './validations.js';
import * as Fedops from '../../wix-fedops-api.js';

// @ts-ignore
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

let savedCount = 0;

const handleAutoSave = () => {
    autorun(() => {
        savedCount++;
        Fedops.appLoadStarted();
        CommunicationPage.autoSaveAnimation.show();

        saveCommunication(state.communication).then(() => {
            CommunicationPage.autoSaveAnimation.hide();
            if (savedCount > 1) {
                state.setDraftStatus(true);
            };
        }).catch((error) => {
            console.error('public/create-email save debounce ', error);
        });

        Fedops.appLoaded();

    }, { delay: TIME.AUTO_SAVE });
}


