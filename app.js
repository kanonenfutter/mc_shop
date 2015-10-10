var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var mongoDB = require('mongoskin');
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore-bcrypt-node');
var email   = require("emailjs");
var faye = require('faye');
var jade = require('jade');
var BSON = require('mongodb').BSONPure;
var session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');

var smtpServer  = email.server.connect({
   user:    "vannak.s.ch@gmail.com", 
   password: "YASXYaqwsa!!", 
   host:    "smtp.gmail.com", 
   ssl:     true
});



var app = express();
var server = http.createServer(app);




// Verbindung zur mongoDB
var db = mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true', {safe: true});

// Passwordless initialisieren
var pathToMongoDb = 'mongodb://localhost/passwordless_db';
passwordless.init(new MongoStore(pathToMongoDb,  { allowTokenReuse: true }));

// Set up a delivery service
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = 'marktplatz.vanakh.ch';
        smtpServer.send({
            text:    'Hi!\nGreife hier auf dein Account zu: http://'+ host + '?token=' + tokenToSend + '&uid='+ encodeURIComponent(uidToSend), 
            from:    'ich <vannak.s.ch@gmail.com>', 
            to:      recipient,
            subject: 'Token for ' + host
        }, function(err, message) { 
            if(err) {
                console.log(err);
            }
            callback(err);
        });
});
// Collection "user_item" binden
db.bind('offers');
var offersCollection = db.offers;

// Collection "users" binden
db.bind('mm_users');
var usersCollection = db.mm_users;


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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//http logger
app.use(morgan('dev'));

//benötigt um Informationen des Requests zu parsen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Middleware, benötigt für cookies
app.use(cookieParser());

// required for passport
app.use(session({secret: '42', saveUninitialized: false, resave: false}));
//Verzeichnisdefinierung fuer den Zugriff von Aussen
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

app.use('/', routes);

//Errorhandling
app.use(function(error, req, res, next) {
    console.error(error.stack);
    res.end(error.message);
    
});



//REST Methoden



//Webserver wird auf Port 3000 erstellt.
server.listen(3000, function(){
	console.log('Express server is running on port 3000');
});
    