import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

// eslint-disable-next-line @wix/cli/no-invalid-backend-import
import { getDownloadFileUrlFromArray } from 'backend/target-audience-handler-wrapper.jsw';

import { sendBi } from 'public/BI/biModule.js';
import { getAudienceDetails } from 'public/audience-handler.js';

$w.onReady(function () {

    try {
        const { uuidsAndMsidsList, needApprovalCounter, campaignId } = wixWindow.lightbox.getContext();

        $w('#downloadCsvNeedApproveBtn').onClick(async (event) => {
            sendBi('approvalStat', { campaignId, 'buttonName': 'downloadCSV' });
            $w('#downloadCsvNeedApproveBtn').disable();
            await downloadReportEvent(uuidsAndMsidsList);
            $w('#downloadCsvNeedApproveBtn').enable();
        })

        $w('#cancelButton').onClick((event) => {
            sendBi('approvalStat', { campaignId, 'buttonName': 'cancel' })
        })

        $w('#xButton').onClick((event) => {
            sendBi('approvalStat', { campaignId, 'buttonName': 'x' })
        })

        $w('#requestApprovalLightBoxText').text = `Request Approval for ${needApprovalCounter || ''} users`;

    } catch (error) {
        //CR add error msg/lightbox/text
        $w('#downloadCsvNeedApproveBtn').enable();
    }

});

const downloadReportEvent = async (uuidsAndMsidsList) => {
    try {
        const audienceData = await getAudienceDetails(uuidsAndMsidsList);
        const url = await getDownloadFileUrlFromArray(audienceData.needAprroval, "needApprovalAudience");
        wixLocation.to(url);
    } catch (err) {
        console.error("downloadReportEvent error, original error: ", err);
    }
}