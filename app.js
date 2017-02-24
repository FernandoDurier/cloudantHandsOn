/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var conductor = require('./src/main.js');
var bodyParser = require('body-parser');
var cors = require('cors')
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/database/flood',conductor.massin);
app.post('/mass/delete',conductor.massdel);
app.post('/select',conductor.select);
app.get('/select/:filter/:value',conductor.selectget);
app.post('/insert',conductor.post);
app.post('/update',conductor.put);
app.post('/delete',conductor.delete);
app.get('/everydoc',conductor.getAll);
app.post('/insert/any',conductor.postAny);
app.post('/bulk/insert',conductor.postBulky);
app.post('/bulk/update',conductor.putBulky);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
