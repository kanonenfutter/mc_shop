    var topic = window.location.pathname + '/anfragen';

    // PubSub client erstellen
    var client = new Faye.Client('/faye');
    // Topic '/fahrten' subscriben
    var subscription = client.subscribe(topic, function(message) {
        addTableRow(message);
        decrementSeatsByOne();
    });
$(document).ready(function() {
    //Bei Seitenaufruf: Cookie "username" wird ausgelesen
    document.getElementById('active_user').innerHTML = getCookie("username");
    populateTable();
    checkSeats();
    checkUser(getCookie("username"));


});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "invalid_user";
};

// Tabelle aufbauen
function populateTable() {
    // get auf Ressource 'topic'
    $.ajax({
        url: topic,
        type: 'GET',
        contentType: 'application/json'
    // Tabellenerweiterung mit Aufruf von addTableRow wenn Promise erfolgreich
    }).done(function(data) {
        data.forEach(function(fahrt) {
        addTableRow(fahrt);
        });
    // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
    }).fail(function(e) {
        alert('Fehler:' + JSON.stringify(e) + ')');
    });
    
};

function addTableRow(message) {
    $('#responses').append('<tr><td>' + message.name + '</td></tr>');
};

function decrementSeatsByOne() {
    var temp = parseInt(document.getElementById('seats').innerHTML);
    document.getElementById('seats').innerHTML = temp -1;
};

function checkSeats() {
    var available_seats = document.getElementById('seats').innerHTML;
    if (available_seats < 1){
        $( '#submit' ).remove();
        alert('Die Fahrt ist leider schon ausgebucht');
    }
};

function checkUser(username){
    var form_username = document.getElementById('name').innerHTML;
    if (username.localeCompare("invalid_user")==0 || username.localeCompare(form_username)==0) {
        $( '#submit' ).remove();
    }
}