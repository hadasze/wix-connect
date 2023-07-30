import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

const receivedData = wixWindow.lightbox.getContext();

const getLinkHTML = (url) => {
    return "<a  href=" + url +
        " class=\"font_8 wixui-rich-text__text\" target=\"_blank\">" + url + "</a>";
}

$w.onReady(function () {
    $w('#contactedUserUUIDText').text = receivedData.user.uuid;
    $w('#contactedUserSiteNameText').text = receivedData.user.site_display_name;
    $w('#contactedUserSiteURLText').text = receivedData.user.url;
    $w('#contactedUserSiteURLText').html = getLinkHTML(receivedData.user.url || '');
    $w('#contactedUserEmployeeEmailText').text = receivedData.user.last_contact_email +'@wix.com';
    $w('#dateOfLastContactedText').text = receivedData.user.last_contact_date;
});
