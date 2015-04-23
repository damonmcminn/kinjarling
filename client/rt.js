var client_id = document.getElementById('global-client-id').value,
    uid = document.getElementById('global-user-id').value;

var socket = io('http://localhost:3788', {
    query: "client_id=" + client_id + "&uid=" + uid
    });

socket.on('updateCal', function(data) {
    if (data.uid != uid) {
        jQuery('#calendar').fullCalendar('refetchEvents');
});
