import { setCommunication, setMyCommunications, setPreview } from './communication-router-handler';

export function communication_Router(request) {
    return setCommunication(request)
}

export function communication_SiteMap(sitemapRequest) {
    return [];
}

export function my_communications_Router(request) {
    return setMyCommunications(request)
}

export function my_communications_SiteMap(request) {
    return [];
}

export function preview_Router(request) {
    return setPreview(request)
}

export function preview_SiteMap(request) {
    return [];
}