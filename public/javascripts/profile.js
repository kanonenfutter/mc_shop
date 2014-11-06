$(document).ready(function() {

    document.getElementById('active_user').innerHTML = getCookie("username");
    search();
    $('#tabelle').on('click', 'td a.linkdeleteoffer',  deleteOffer);


});

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "invalid_user";
};

function search() {
    //Querystring bauen
    var query = 'name=' + document.getElementById('active_user').innerHTML;
    //GET und Suchanfrage auf "/search"
    $.ajax({
        url: '/search',
        type: 'GET',
        data: query,
        contentType: 'application/json'
    // Tabellenerweiterung mit Aufruf von addTableRow wenn Promise erfolgreich
    }).done(function(data) {
        if (JSON.stringify(data) != '[]') {
            data.forEach(function(offer) {
                addTableRow(offer);
            });
        } else {
            alert('Du hast noch kein Angebot erstellt!');
        }
    // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
    }).fail(function(e) {
        alert('Fehler:' + JSON.stringify(e) + ')');
    });
    
};

// Zeile/Dokument zur Tabelle hinzufuegen 
function addTableRow(offer) {
    $('#tabelle').append('<tr><td>' + offer.name + '</td><td>' + offer.itemname + '</td><td>' + offer.quantity + '</td><td>' + offer.price + '</td><td>' + offer.unitprice + '</td><td>' + offer.availability + '</td><td>'+ '<a href="#" class="linkdeleteoffer" rel="'+ offer._id +'">delete</a>' + '<a href="/offers/'+ offer._id + '"> details</a></td></tr>');
    };

// Offer entfernen
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