import * as SentTestEmail from 'public/Pages/Send-Test-Email';

$w.onReady(function () {

    SentTestEmail.Send.setEvents();
    SentTestEmail.Success.setEvents();
    SentTestEmail.Error.setEvents();

});

