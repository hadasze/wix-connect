import * as SentTestEmail from 'public/Pages/SendTestEmail';

$w.onReady(function () {

    SentTestEmail.Send.setEvents();
    SentTestEmail.Success.setEvents();
    SentTestEmail.Error.setEvents();

});

