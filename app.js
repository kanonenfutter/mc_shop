var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var mongoDB = require('mongoskin');
var faye = require('faye');
var jade = require('jade');
var BSON = require('mongodb').BSONPure;
var app = express();
var server = http.createServer(app);

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

// Verbindung zur mongoDB

var db = mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true', {safe: true});

// Collection "user_item" binden

db.bind('offers');

var offersCollection = db.offers;


// Faye
// NoteAdapter konfigurieren
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});

// Nodeadapter zum http-Server hinzufuegen
bayeux.attach(server);
//PubSub-Client erzeugen
var pubSubClient = bayeux.getClient();

//Verzeichnisdefinierung fuer den Zugriff von Aussen
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//benötigt um Informationen des Requests zu parsen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//http logger
//app.use(express.logger('dev'));
app.use(morgan('dev'));

//Middleware, benötigt für cookies
app.use(cookieParser());

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Errorhandling
app.use(function(error, req, res, next) {
    console.error(error.stack);
    res.end(error.message);
    
});


//get-response auf die Ressource /fahrten. Ausgabe aller Fahrten.
app.get('/offers', function(req, res, next) {
    offersCollection.findItems(function(error, result) {
        if (error)
            next(error);
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});

//get auf die Ressource /search. Eingabe: Suchanfrage. Ausgabe: Suchergebnisse
app.get('/search', function (req, res, next) {
    offersCollection.find(req.query).toArray(function(error, result) {
        if (error)
            next(error);
        else {
            console.log('Result:');
            console.log(result);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});

//get auf die Ressource /fahrten/:id. Detailansicht einer Fahrt
app.get('/offers/:id', function (req, res, next) {
    console.log("GET: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
    offersCollection.find({_id: obj_id}).toArray(function(error, result) {
        if (error)
            next(error);
        else {
            console.log('Result:');
            console.log(result);
            console.log(result[0]);
//            res.writeHead(200, {'Content-Type': 'application/json'});
//            res.end(JSON.stringify(result));
            res.render('details', result[0]);
            res.end();
        }
    });
});

//get auf die Ressource /fahrten/:id/anfragen.
/*app.get('/offers/:id/anfragen', function (req, res, next) {
    console.log("GET: " + JSON.stringify(req.url));
    console.log("param: fahrt_id:" + req.params.id);
    mitfahrerCollection.find({fahrt_id: req.params.id}).toArray(function(error, result) {
        console.log("suche auf mitfahrer");
        if (error)
            next(error);
        else {
            console.log('Result:');
            console.log(result);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        }
    });
});*/

//delete auf die Ressource /fahrten/:id
app.delete('/offers/:id', function(req, res) {
    console.log("DEL: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
    offersCollection.remove({_id: obj_id}, function(error, offersCollection){
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log(obj_id + ' wurde aus der Datenbank gelöscht!');
        }
    });
});

//post-response auf die Ressource /fahrten
app.post('/offers', function(req, res, next) {
    offersCollection.insert(req.body, function(error, offersCollection){
        console.log(req.body.unitprice);
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log('Das Angebot:' + JSON.stringify(req.body) + ' wurde zur Datenbank hinzugefuegt!');
            console.log(req.body._id);
        }
    });
    // Dokument an Topic '/offers' publishen
	var publication = pubSubClient.publish('/offers', req.body);
	// Promise handler wenn Publish erfolgreich
	publication.then(function() {
		// Response HTTP status code 200 an Client
		res.writeHead(200, 'OK');
		// Name vom Objekt in der Konsole ausgeben
		console.log(req.body._id + ' published to "/offers"!');
		res.end();
	// Promise handler wenn Publish fehlgeschlagen
	}, function(error) {
		next(error);
	});
});

//post-response auf die Ressource /fahrten/:id/anfragen
app.post('/fahrten/:id/anfragen', function(req, res, next) {
    console.log("POST: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    console.log(req.body);
    console.log(req.body.name);
    mitfahrerCollection.insert(req.body, function(error, mitfahrerCollection){
        if (error) next(error);
        else {
            console.log('Anfrage:' + JSON.stringify(req.body) + ' wurde zur Datenbank hinzugefuegt!');
            console.log(req.body._id);
        }
    });
    var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
    offersCollection.update({_id: obj_id}, {'$inc':{seats:-1}}, function(err) {
        if (err) throw err;
        console.log('Updated!');
    });

    
    // Dokument an Topic '/fahrten/:id/anfragen' publishen
	var publication = pubSubClient.publish(req.url, req.body);
	// Promise handler wenn Publish erfolgreich
	publication.then(function() {
		// Response HTTP status code 200 an Client
		res.writeHead(200, 'OK');
		// Name vom Objekt in der Konsole ausgeben
		console.log(req.body._id + ' published to "/fahrten/' + req.params.id+ '"!');
		res.end();
	// Promise handler wenn Publish fehlgeschlagen
	}, function(error) {
		next(error);
	});
});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });
    

//Webserver wird auf Port 3000 erstellt.
server.listen(3000, function(){
	console.log('Express server is running on port 3000');
});
    