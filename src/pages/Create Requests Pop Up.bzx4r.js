import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import { getDownloadFileUrlFromArray } from 'backend/target-audience-handler-wrapper.jsw';
import { getAudienceDetails } from 'public/audience-handler.js';

$w.onReady(function () {

    try {
        const { uuidsAndMsidsList, needApprovalCounter } = wixWindow.lightbox.getContext();
      
        $w('#downloadCsvNeedApproveBtn').onClick(async (event) => {
            $w('#downloadCsvNeedApproveBtn').disable();
            await downloadReportEvent(uuidsAndMsidsList);
            $w('#downloadCsvNeedApproveBtn').enable();
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