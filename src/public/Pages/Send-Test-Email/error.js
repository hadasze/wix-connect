import { SendTestEmail as Comp } from '../../components.js';

export function setEvents() {

    Comp.tryAgainButton.onClick(async (event) => {
        await Comp.sendMultiStateBox.changeState(Comp.States.Send);
    });
    
}