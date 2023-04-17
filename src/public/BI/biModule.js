import { biLoggerFactory } from 'wix-private';
import { rendering } from 'wix-window';

import { biEvents } from './biEvents'

const SRC = 11
const END_POINT = 'wix-connect'

const platformBiLogger = biLoggerFactory(END_POINT, SRC, {})

export const sendBi = (eventName, params = {}) => {
    if (rendering.env === 'backend') return

    params.evid = biEvents[eventName]
    params.session_id = self.fedops.sessionId

    return platformBiLogger.log(params)
}