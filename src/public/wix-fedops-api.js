// @ts-ignore
import { create } from 'wix-fedops';
import { fedopsEvents } from './consts';

const fedopsLogger = create('wix-connect');

export const interactionStarted = (eventName) => fedopsLogger.interactionStarted(eventName);
export const interactionEnded = (eventName) => fedopsLogger.interactionEnded(eventName);

export const appLoadStarted = () => fedopsLogger.appLoadStarted();
export const appLoaded = () => fedopsLogger.appLoaded();

export const events = fedopsEvents;