import * as SentCommunication from 'public/Pages/Send-Communication';

$w.onReady(function () {
    SentCommunication.Send.setEvents();
    SentCommunication.Success.setEvents();
    SentCommunication.Error.setEvents();
});