import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';
import { getIsContactedUser, getContactedEmailByMemberID } from 'backend/data-methods-wrapper.jsw';

const receivedData = wixWindow.lightbox.getContext();
const getIsContactedUserRes = getIsContactedUser(receivedData.user.uuid);

$w.onReady(async function () {

    $w('#contactedUserUUIDText').text = receivedData.user.uuid;
    $w('#contactedUserSiteNameText').text = receivedData.user.site_display_name;
    $w('#contactedUserSiteURLText').text = receivedData.user.url;
    $w('#contactedUserEmployeeEmailText').text = receivedData.user.last_contact_email || await getLastContactEmail();
    $w('#dateOfLastContactedText').text = receivedData.user.last_contact_date || await getLastContactDate();

    $w('#contactedUserSiteURLText').onClick(() => {
        sendBi('sideBarOptions', { 'campaignId': receivedData.communication._id, 'uuidChosen': receivedData.user.uuid, 'cloumnName': 'contacted', 'button_name': 'site_url' })
    })
});

async function getLastContactEmail() {
    const contactedMember = await getIsContactedUserRes;
    if (contactedMember) {
        const contactedMemberEmail = await getContactedEmailByMemberID(contactedMember._owner);
        return contactedMemberEmail;
    }
    return '';
}

async function getLastContactDate() {
    const contactedMember = await getIsContactedUserRes;
    return contactedMember?._createdDate || '';
}