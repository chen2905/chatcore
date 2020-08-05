const path = require('path')
/*The path module of Node. js provides useful functions to interact with file paths. 
... sep which provides the path segment separator ( \ on Windows, and / on Linux / macOS),
 and path. delimiter which provides the path delimiter ( ; on Windows, and : on Linux / macOS). 
 
*/
const http = require('http')
/*
Node. js has a built-in module called HTTP, which allows Node. js to transfer data over the Hyper
Text Transfer Protocol (HTTP). To include the HTTP module, use the require() method: var http = require('http');
*/
const express = require('express')
/*Express is a minimal and flexible Node.js web application framework that provides
 a robust set of features to develop web and mobile applications. It facilitates the 
 rapid development of Node based Web applications. 
 
 The Express.js framework makes it very easy to develop an application which can be used 
 to handle multiple  types of requests like the GET, PUT, and POST and DELETE requests.*/
const socketio= require('socket.io')
/*
Socket.IO is a library that enables real-time, bidirectional and event-based communication between the browser and the server. 
It consists of: ... js server: Source | API. a Javascript client library for the browser (which can be also run from Node. js): Source | API.
*/
const formatMessage = require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botName="Chat Bot"
//set static folder
app.use(express.static(path.join(__dirname,'public')))

/*
app. use(express. static('public')); Note − Express looks up the files relative to the static directory, 
so the name of the static directory is not part of the URL. Note that the root route is now set to your public dir, 
so all static files you load will be considering public as root.
*/

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      //server captue a event emit from client
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);//You can call join to subscribe the socket to a given channel:
  
      // server then emit a message to that client, the formatMessage is from message.js
      // it is returning json object, contains message,username and current time
      socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
  
      // Broadcast to the channel that a user join
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info to the client and to the channel client belongs to 
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  // Listen for chatMessage from different client
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
    //server got message from one client and broadcast to all the clients in the same channel
  });

  //Runs when client disconnects
  socket.on('disconnect',()=>{
      const user = userLeave(socket.id)
      if(user){
          io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
      }
  })
})

const PORT = process.env.PORT||3000

server.listen(PORT,()=> console.log(`Server running on port ${PORT}`))


  