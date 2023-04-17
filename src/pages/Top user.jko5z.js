import wixWindow from 'wix-window';
import { sendBi } from 'public/BI/biModule.js';
import { AllVerticals, Labels } from 'public/consts.js'

$w.onReady(function () {
    const receivedData = wixWindow.lightbox.getContext();
    $w('#topUserUUIDText').text = receivedData.user.uuid;
    $w('#topUserSiteNameText').text = receivedData.user.site_display_name;
    $w('#topUserSiteURLText').text = receivedData.user.url;
    $w('#topUserSiteURLText').onClick(() => {
        sendBi('sideBarOptions', { 'campaignId': receivedData.communication._id, 'uuidChosen': receivedData.user.uuid, 'cloumnName': 'topUser', 'button_name': 'site_url' })
    })

    handleVerticalsRepeater(receivedData.user)
});

const handleVerticalsRepeater = (user) => {
    const topUserVerticals = []
    AllVerticals.forEach(vertical => {
        if (vertical.shouldDispaly(user))
            topUserVerticals.push(vertical);
    });

    $w('#topUserForRepeater').onItemReady(($item, itemData, index) => {
        $item('#verticalNameText').text = Labels[itemData.verticalTitle];
        const fields = itemData.fields;
        let stringToDispaly = '<p class="p1">';
        for (let i = 0; i < fields.length; i++) {
            const fieldName = fields[i];
            const icon = user[fieldName] ? '✔️  ' : '✗  ';
            stringToDispaly = stringToDispaly + `<a>${icon} ${Labels[fieldName]}</a><br/>`;
        }
        stringToDispaly = stringToDispaly + '</p>'
        $item('#verticalCategoriesText').html = stringToDispaly;
    });
    $w('#topUserForRepeater').data = topUserVerticals;
}