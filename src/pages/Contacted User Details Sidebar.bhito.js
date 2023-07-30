import wixWindow from 'wix-window';

import { ContactedUserDetailsSidebar as Comp } from 'public/components.js';

const receivedData = wixWindow.lightbox.getContext();

const getLinkHTML = (url) => {
    return "<a  href=" + url +
        " class=\"font_8 wixui-rich-text__text\" target=\"_blank\">" + url + "</a>";
}

$w.onReady(function () {
    Comp.contactedUserUUIDText.text = receivedData.user.uuid;
    Comp.contactedUserSiteNameText.text = receivedData.user.site_display_name;
    Comp.contactedUserSiteURLText.text = receivedData.user.url;
    Comp.contactedUserSiteURLText.html = getLinkHTML(receivedData.user.url || '');
    Comp.contactedUserEmployeeEmailText.text = receivedData.user.last_contact_email + '@wix.com';
    Comp.dateOfLastContactedText.text = receivedData.user.last_contact_date;
});
