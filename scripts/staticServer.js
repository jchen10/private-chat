
//----------------------------------------------------------\\
//-----------  load all required node modules --------------\\
//----------------------------------------------------------\\
const httpServer = require('http').createServer(httpHamdler).listen(81)
const url = require('url')  // URL parsing utility
const fs = require('fs')  // file system utillity
const path = require('path') // file path utility
const WebSocketServer = require('ws').Server // our websocket server class

// instantiates a websocket server object
let socketServer = new WebSocketServer({ server: httpServer })

//----------------------------------------------------------\\
//------  handles all http requests for this localhost -----\\
//----------------------------------------------------------\\
function httpHamdler(req, res) {
  const parsedUrl = url.parse(req.url); // get the request URL e.g.(http://192.168.1.143:81)

  // check the url for any path/page request (if none, defaults to 'index.html')
  let pathname = `.${parsedUrl.pathname}` // see: ES6 Template Strings

  // mime-types based on a file extention
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };

  // make sure the requested file exists, then
  // load it, and return its content to the requesting
  // browser. the initial 'html' file will make
  // several 'file' requests e.g. css files, js files, images, ....
  fs.exists(pathname, function (exist) {
    // NO ... respond with 'not found' (404)
    if (!exist) {
      res.statusCode = 404
      res.end(`File ${pathname} not found!`)
      return
    }
    // if the request-path is not a file, default to 'index.html'
    if (fs.statSync(pathname).isDirectory()) { // look for an index.html file
      pathname += '/index.html'
    }
    // try to load the file and return it to the browser
    fs.readFile(pathname, function (err, data) { // read the html file
      if (err) {
        res.statusCode = 500
        res.end(`Error getting the file: ${err}.`)
      }
      else {
        // get the requests file extention to determin the mime-type
        const ext = path.parse(pathname).ext
        // set the response headers mime-type, so the browser knows
        // how to handle it.
        res.setHeader('Content-type', mimeType[ext] || 'text/plain')
        // pass the files content (data) back to the browser (http-response)
        res.end(data)
      }
    });
  });
}

//----------------------------------------------------------\\
//---------- unique colors for chat members ----------------\\
//----------------------------------------------------------\\
var chatColors = [
  { ownerID: '', color: 'red' },
  { ownerID: '', color: 'green' },
  { ownerID: '', color: 'RoyalBlue' },
  { ownerID: '', color: 'GoldenRod' }
];

//----------------------------------------------------------\\
//--------=----  socket event processing  ------------------\\
//----------------------------------------------------------\\

// NOTE: Each new connection creates a unique client object.
// The 'client' object below is unique to each new connection.
// Each new user gets their own copy of each of the methods below ...

// socket connection event handler
socketServer.on('connection', function (client) {
  // for each new client ... set the clients attributes
  client.id = ''
  client.name = ''
  client.color = ''
  // handle all socket messages sent by this client
  client.on('message', (message) => {
    // unpack the message string
    var msg = JSON.parse(message)
    switch (msg.type) {
      case 'RegisterChatter':
        // when this user 'registers' (first message sent from the app)
        // set all passed-in client attributes
        client.id = msg.data.id
        client.name = msg.data.name
        client.color = setColor(client) // assign a unique color for this client
        // send this color back to the user to be used in all 'chat-message' payloads
        msg.data.color = client.color
        // inform all registered clients about this new user
        broadcastAll(client, 'RegisterChatter', msg.data)
        break
      case 'chat-message':
        // relay all messages from this client to all registered clients
        broadcastAll(client, 'chat-message', msg.data)
        break
      default:
        break
    }
  });

  // handles socket-close event
  // broadcast that this user has exited the hat session
  // free-up the users color to be reused
  client.on('close', (message) => {
    broadcastAll(client, 'ChatterExited', {name: client.name})
    freeTheColor(client)
  })
})

//----------------------------------------------------------\\
//-----  get a unique (unused) color for each new user -----\\
//----------------------------------------------------------\\
var setColor = function (client) {
  for (var i = 0; i < 4; i++) {
    var thisColor = chatColors[i]
    if (thisColor.ownerID === '') {
      client.color = thisColor.color
      thisColor.ownerID = client.id
      console.log('setting color for ' + client.name + ' to: ' + thisColor.color + ' or: ' + client.color)
      return thisColor.color
    }
  }
}

//----------------------------------------------------------\\
//--- free-up the assigned color when a user disconnects ---\\
//----------------------------------------------------------\\
var freeTheColor = function (client) {
  for (var i = 0; i < 4; i++) {
    var thisColor = chatColors[i]
    if (thisColor.ownerID === client.id) {
      thisColor.ownerID = ''
      console.log('freeing color: ' + thisColor.color)
      return
    }
  }
};

//----------------------------------------------------------\\
//--  broadcasts to all socket clients except the sender ---\\
//----------------------------------------------------------\\
var broadcast = function (client, name, data) {
  for (var i in socketServer.clients) {
    if (client !== socketServer.clients[i]) {
      socketServer.clients[i].send(JSON.stringify({ type: name, data: data }))
    }
  }
};

//----------------------------------------------------------\\
//- broadcasts to all socket clients including the sender --\\
//----------------------------------------------------------\\
var broadcastAll = function (client, name, data) {
  for (var i in socketServer.clients) {
    //console.log('broadcastAll: ' + JSON.stringify({ type: name, data: data }))
    socketServer.clients[i].send(JSON.stringify({ type: name, data: data }))
  }
}
