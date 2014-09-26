$(document).ready(function() {
    document.getElementById('active_user').innerHTML = getCookie("username"); 
    
    // Delete User link click
    //$('#tabelle').on('click', 'td a.linkdeletefahrt',  deleteFahrt);
    $('#searchform').on('click', '.linksearch',  search);

    

});


// Tabelle aufbauen
function search() {
    //Tabelle zurücksetzen
    $( "#tabelle td" ).remove();
    //Querystring bauen
    var query = 'destination=' + document.getElementById('input_search').value;
    //GET und Suchanfrage auf "/search"
    $.ajax({
        url: '/search',
        type: 'GET',
        data: query,
        contentType: 'application/json'
    // Tabellenerweiterung mit Aufruf von addTableRow wenn Promise erfolgreich
    }).done(function(data) {
        if (JSON.stringify(data) != '[]') {
            data.forEach(function(fahrt) {
                addTableRow(fahrt);
            });
        } else {
            alert('Suche verlief erfolglos');
        }
    // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
    }).fail(function(e) {
        alert('Fehler:' + JSON.stringify(e) + ')');
    });
    
};

// Zeile/Dokument zur Tabelle hinzufuegen 
function addTableRow(fahrt) {
    $('#tabelle').append('<tr><td>' + fahrt.name + '</td><td>' + fahrt.start + '</td><td>' + fahrt.destination + '</td><td>' + fahrt.date + '</td><td>' + fahrt.time + '</td><td>' + fahrt.seats + '</td><td>' + '<a href="/fahrten/'+ fahrt._id + '"> details</a></td></tr>');
    };

//Cookie auslesen
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
