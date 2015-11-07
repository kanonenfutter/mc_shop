var express = require('express');
var BSON = require('mongodb').BSONPure;
var router = express.Router();

var passwordless = require('passwordless');
var mongoDB = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;


// Verbindung zur mongoDB
var db = mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true', {safe: true});

// Collection "user_item" binden
db.bind('offers');
var offersCollection = db.offers;

// Collection "users" binden
db.bind('users');
var usersCollection = db.users;


//REST Methoden

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { user: req.user });
});


router.get('/offers', function(req, res, next) {
    offersCollection.find().sort( [['_id', -1]] ).toArray(function(error, result) {
        if (error)
            next(error);
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});

router.get('/add', passwordless.restricted({failureRedirect: '/login'}),function(req, res) {
    res.sendfile('views/add.html');
});

router.get('/profile', function(req, res) {
    res.sendfile('views/profile.html');
});



//GET auf die Ressource /results. Eingabe: Suchanfrage. Ausgabe: Suchergebnisse
router.get('/results', function (req, res, next) {
    offersCollection.find(req.query).sort( [['_id', -1]] ).toArray(function(error, result) {
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

// Item/Verkäufer Suche
router.get('/search', function (req, res, next) {
    res.sendfile('views/search.html');
});

//get auf die Ressource /offers/:id. Detailansicht eines Angebots
router.get('/offers/:id', function (req, res, next) {
    console.log("GET: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    //var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
	var obj_id = ObjectID.createFromHexString(req.params.id)
	
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

//DELETE auf die Ressource /offers/:id
router.delete('/offers/:id', function(req, res) {
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

//post-response auf die Ressource /offers
router.post('/offers', function(req, res, next) {
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

//post-response auf die Ressource /offers/:id/anfragen
//TODO: Ändern...
router.post('/offers/:id/anfragen', function(req, res, next) {
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

router.get('/login', function(req, res) {
  res.sendfile('views/login.html');
});

/* POST login details. */
router.post('/sendtoken', 
    passwordless.requestToken(
        // Turn the email address into an user ID
        function(user, delivery, callback, req) {
          // but you could also do the following 
          // if you want to allow anyone:
            callback(null, user);
        }),
    function(req, res) {
    // success!

        console.log(req.body);
        usersCollection.find(req.body).toArray(function(error, result) {
        if (error)
            next(error);
        else {
            console.log('Result:');
            console.log(result);
//            res.writeHead(200, {'Content-Type': 'application/json'});
//            res.end(JSON.stringify(result));
            if (result == '[]') {
                res.sendfile('views/success_setname.html');
            } else {
                res.sendfile('views/success.html');
            }
        }
    });
});

/* POST login details. */
router.post('/setname', function(req, res, next) { 

});


router.post('/setname')


router.get('/logged_in', passwordless.acceptToken(), 
    function(req, res) {
        res.redirect('/add');
});





module.exports = router;