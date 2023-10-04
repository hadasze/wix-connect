import { SendTestEmail as Comp } from '../../components.js';
import { getOwnerEmail } from '../../_utils.js';

export function enableSendBtn() {
    Comp.testEmailsInput.updateValidityIndication();
    Comp.testEmailsInput.value.length > 0 ? Comp.sendBtn.enable() : Comp.sendBtn.disable();
}


export function init() {
    Comp.testEmailsInput.value = getOwnerEmail();
    enableSendBtn();
}