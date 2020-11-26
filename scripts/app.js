//----------------------------------------------------------\\
//----------------------  Private Chat ---------------------\\
//----------------------------------------------------------\\

var privateApp = (function () {
  'use strict'

  class App {

    constructor() {
      this.id = this.generateID()
      this.name = ''
      this.pswd = ''
      this.color = 'black'
      // convert the origins' http url to a ws (websocket) url
      let HOST = location.origin.replace(/^http/, 'ws')
      // connect to our socket-server
      this.socket = new WebSocket(HOST)
    }

    // sends messages to the socket-server using
    // a named message type, and an encrypted payload(msg)
    socketSend(msgTypeName, msgData) {
      if (this.socket) {
        var msg = JSON.stringify({ type: msgTypeName, data: msgData })
        this.socket.send(msg)
      } else {
        while (!(this.socket)) {
          console.log('No open WebSocket connections.')
        }
        this.socketSend(msgTypeName, msgData)
      }
      return this
    }

    // generates a unique id string
    generateID() {
      let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let num = 10
      let id = ''
      for (var i = 0; i < num; i++) {
        chars[i]
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id
    }

    // builds and inserts a new html-list item <li>
    // adds a click handler used to delete this <li>
    buildListItem(data, msg) {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(msg))
      if (data.id === this.id) {
        this.color = data.color
      }
      li.style.color = data.color
      let remove_li = (e) => {
        li.parentElement.removeChild(li)
      }
      li.onclick = remove_li
      setTimeout(remove_li, 60 * 1000)
      return li
    }

  }

  // instantiate our app object
  var app = new App()

  // when all elements have been loaded
  window.onload = function () {
    // get name and passcode
    app.name = prompt("Please enter your name", "")
    app.pswd = prompt("Please enter the passcode", "")
    // set references to key html elements
    let messages = document.getElementById('messages')
    let sendButton = document.getElementById('sendbutton')
    let msgBox = document.getElementById('msgBox')
    // init vars
    let encrtext = ''
    let decrtext = ''
    let encriptedName = ''
    let decriptedName = ''

    app.socket.onopen = event => {

      // incoming socket message handler
      app.socket.onmessage = (message) => {
        // all messages are sent as encripted strings
        // here we parse them back to objects
        let payload = JSON.parse(message.data)
        // get the message-type name
        let messageType = payload.type
        switch (messageType) {
          // new user joined
          case 'RegisterChatter':
            // decrypt the senders name
            decriptedName = Tea.decrypt(payload.data.name, app.pswd)
            // turn it into a new <li> element and add it
            // to our list <ul> element named 'message'
            messages.appendChild(app.buildListItem(payload.data, decriptedName + ' joined the chat!'))
            break;
          // a user has exited (closing his socket connection)
          case 'ChatterExited':
            // decrypt the senders name
            decriptedName = Tea.decrypt(payload.data.name, app.pswd);
            // turn it into a new <li> element and add it
            // to our list <ul> element named 'message'
            messages.appendChild(app.buildListItem(payload.data, decriptedName + ' exited this chat!'))
          // a user posted a chat message
          case 'chat-message':
            // decrypt the senders name
            decriptedName = Tea.decrypt(payload.data.name, app.pswd);
            // decrypt the senders message payload
            decrtext = Tea.decrypt(payload.data.msg, app.pswd);
            // turn them into a new <li> element and add it
            // to our list <ul> element named 'message'
            messages.appendChild(app.buildListItem(payload.data, decriptedName + ' >> ' + decrtext))
            break;
        }
      }

      app.socketSend('RegisterChatter', { id: app.id, name: encriptedName })
    }

    // handle the 'send' button click event
    // encripts both the sender name and the text (message) from the
    // 'msgBox' input element. then sends this to our socket-server
    sendButton.addEventListener('click', () => {
      encriptedName = Tea.encrypt(app.name, app.pswd);
      encrtext = Tea.encrypt(msgBox.value, app.pswd);
      app.socketSend('chat-message', { id: app.id, name: encriptedName, msg: encrtext, color: app.color })
      msgBox.value = ''
    })

    // we now kick-off this app by encripting our own name
    // and sending it to the socket-server, where it will
    // be broadcast to every registered user (including this user)
    encriptedName = Tea.encrypt(app.name, app.pswd);

  }

  return App;
}());
