$(document).ready(function() {
    document.getElementById('active_user').innerHTML = getCookie("username"); 
    
    // Delete User link click
    //$('#tabelle').on('click', 'td a.linkdeleteOffer',  deleteOffer);
    $('#searchform1').on('click', '.searchitem',  itemq);
    $('#searchform2').on('click', '.searchseller',  sellerq);

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
            cb(matches);
        };
    };
 
var items = ['Stein',
'Grasblock',
'Erde',
'Pflasterstein',
'Eichenholzbretter',
'Fichtenholzbretter',
'Birkenholzbretter',
'Tropenholzbretter',
'Akazienholzbretter',
'Schwarzeichenholzbretter',
'Eichensetzling',
'Fichtensetzling',
'Birkensetzling',
'Tropenbaumholzsetzling', 'Akaziensetzling',
'Schwarzeichensetzling',
'Bedrock',
'Wasser',
'Lava',
'Sand',
'Kies',
'Steinkohle',
'Eichenholz',
'Fichtenholz',
'Birkenholz',
'Tropenholz',
'Akazienholz',
'Schwarzeichenholz',
'Eichenlaub',
'Fichtennadeln',
'Birkenlaub',
'Tropenbaumlaub',
'Akazienlaub',
'Schwarzeichenlaub',
'Glas',
'Lapislazulierz',
'Lapislazuliblock',
'Werfer',
'Sandstein',
'Notenblock',
'Bett',
'Antriebsschiene',
'Sensorschiene',
'Klebriger_Kolben',
'Spinnennetz',
'Gras',
'Toter_Busch',
'Kolben',
'Wolle',
'Loewenzahn',
'Mohn',
'Brauner_Pilz',
'Fliegenpilz',
'Goldblock',
'Eisenblock',
'Stufe',
'Ziegelsteine',
'TNT',
'Buecherregal',
'Bemooster_Bruchstein',
'Obsidian',
'Fackel',
'Monsterspawner',
'Eichenholztreppe',
'Truhe',
'Redstone?',
'Werkbank',
'Weizen',
'Ofen',
'Schild',
'Eichenholztuer',
'Leiter',
'Schienen',
'Pflastersteintreppe',
'Hebel',
'Steindruckplatte',
'Eisentuer',
'Holzdruckplatte',
'Redstone-Erz',
'Redstone-Fackel',
'Knopf',
'Eis',
'Schneeblock',
'Kaktus',
'Ton_ungebrannt',
'Zuckerrohr',
'Plattenspieler',
'Zaun',
'Kuerbis',
'Netherstein',
'Seelensand',
'Glowstone',
'Kuerbislaterne',
'Kuchen',
'Redstone-Verstaerker',
'(Gef_glas)',
'Falltuer',
'Steinziegel',
'Eisengitter',
'Glasscheibe',
'Melonenblock',
'Ranken',
'Zauntor',
'Ziegeltreppe',
'Steinziegeltreppe',
'Myzel',
'Seerosenblatt',
'Netherziegel',
'Netherziegelzaun',
'Netherziegeltreppe',
'Netherwarze',
'Zaubertisch',
'Braustand',
'Kessel',
'Endstein',
'Drachenei',
'Redstonelampe',
'Holzstufe',
'Sandsteintreppe',
'Smaragderz',
'Endertruhe',
'Haken',
'Smaragdblock',
'Fichtenholztreppe',
'Birkenholztreppe',
'Tropenholztreppe',
'Leuchtfeuer',
'Mauer',
'Blumentopf',
'Holzknopf',
'Kopf',
'Amboss',
'Redstonetruhe',
'Redstonekomparator',
'Tageslichtsensor',
'Redstoneblock',
'Netherquarzerz',
'Trichter',
'Quartzblock',
'Quartztreppe',
'Aktivierungsschiene',
'Spender',
'(gef_ton)',
'(gef_glasscheibe)',
'Akazienholztreppe',
'Schwarzeichenholztreppe',
'Schleimblock',
'Eisenfalltuer',
'Prismarin',
'Seelaterne',
'Strohballen',
'(Teppich)',
'Ton_gebrannt',
'Kohleblock',
'Packeis',
'Sonnenblume',
'Banner',
'Wandbanner',
'Nachtlichtsensor',
'Roter_Sandstein',
'Rote_Sandsteintreppe'];
    
var valuables = ['Diamant',
                 'Eisenbarren',
                 'Goldbarren',
                 'Golderz',
                 'Eisenerz',
                 'Diamanterz',
                 'Diamantblock',
                 'Eisenblock',
                 'Goldblock'];
    
    
    
    
// bloodhound
// ----------

// constructs the suggestion engine
var items = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  // `items` is an array of state names defined in "The Basics"
  local: $.map(items, function(item) { return { value: item }; })
});
    
// constructs the suggestion engine
var valuables = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  // `items` is an array of state names defined in "The Basics"
  local: $.map(valuables, function(valuable) { return { value: valuable }; })
});

// kicks off the loading/processing of `local` and `prefetch`
items.initialize();
valuables.initialize();

$('#bloodhound .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'items',
  displayKey: 'value',
  // `ttAdapter` wraps the suggestion engine in an adapter that
  // is compatible with the typeahead jQuery plugin
  source: items.ttAdapter()
},
{
  name: 'valuables',
  displayKey: 'value',
  // `ttAdapter` wraps the suggestion engine in an adapter that
  // is compatible with the typeahead jQuery plugin
  source: valuables.ttAdapter()
});
    

});

function itemq() {
    var query = 'itemname=' + document.getElementById('itemq').value;
    search(query);
};

function sellerq() {
    var query = 'name=' + document.getElementById('sellerq').value;
    search(query);
};
    

// Tabelle aufbauen
function search(query) {
    //Tabelle zurücksetzen
    $( "#tabelle td" ).remove();
    //Querystring bauen
//    var query = 'itemname=' + document.getElementById('searchquery').value;
    //GET und Suchanfrage auf "/search"
    $.ajax({
        url: '/results',
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
            alert('Die Suche verlief erfolglos.');
            $('#searchform1').reset();
            $('#searchform2').reset();
        }
    // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
    }).fail(function(e) {
        alert('Fehler:' + JSON.stringify(e) + ')');
    });
    
};

// Zeile/Dokument zur Tabelle hinzufuegen 
function addTableRow(offer) {
    $('#tabelle').append('<tr><td>' + offer.name + '</td><td>' + offer.itemname + '</td><td>' + offer.quantity + '</td><td>' + offer.price + '</td><td>' + offer.unitprice + '</td><td>' + offer.availability + '</td><td>' + '<a href="/offers/'+ offer._id + '"> details</a></td></tr>');
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
