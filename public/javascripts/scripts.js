
    // PubSub client erstellen
    var client = new Faye.Client('/faye');
    // Topic '/fahrten' subscriben
    var subscription = client.subscribe('/offers', function(message) {
        addTableRow(message);
    });

$(document).ready(function() {
    document.getElementById('active_user').innerHTML = getCookie("username"); 
    populateTable();
    // Delete User link click
    $('#tabelle').on('click', 'td a.linkdeleteoffer',  deleteOffer);

    $('#searchform').on('click', 'a.search',  startsearch);

});

// Tabelle aufbauen
function populateTable() {
    // get auf Ressource '/fahrten'
    $.ajax({
        url: '/offers',
        type: 'GET',
        contentType: 'application/json'
    // Tabellenerweiterung mit Aufruf von addTableRow wenn Promise erfolgreich
    }).done(function(data) {
        data.forEach(function(offer) {
        addTableRow(offer);
        });
    // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
    }).fail(function(e) {
        alert('Fehler:' + JSON.stringify(e) + ')');
    });
    
};

// Zeile/Dokument zur Tabelle hinzufuegen 
function addTableRow(offer) {
    $('#tabelle').append('<tr><td>' + offer.name + '</td><td>' + offer.itemname + '</td><td>' + offer.quantity + '</td><td>' + offer.price + '</td><td>' + offer.unitprice + '</td><td>' + offer.availability + '</td><td>' + '<a href="/offers/'+ offer._id + '"> details</a></td></tr>');
    };

// Fahrt entfernen
function deleteOffer(event) {

    event.preventDefault();

    // Popup confirmation dialog
    var confirmation = confirm('Sind Sie sicher, dass Sie den Eintrag löschen möchten?');

    // Check, if the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/offers/' + $(this).attr('rel')
        });
        location.reload();
    }
    // Else: do nothing
    else {
        return false;
    }

};

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "invalid_user";
}
    