const path = require('path')
const http = require('http')
const express = require('express')
const socketio= require('socket.io')
const formatMessage = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botName="Chat Bot"
//set static folder
app.use(express.static(path.join(__dirname,'public')))


io.on('connection',socket =>{
    // Welcome current user
    socket.on('joinRoom',({username,room})=>{
  //message to the user only
  socket.emit('message',formatMessage(username,'Welcome to ChatCord'))

  //message to all the users except the user
  socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chat'))

    })


  
    //runs when client disconnects
    socket.on('disconnect', ()=> {
        io.emit('message',formatMessage(botName, 'A user has left the chat'))
    })

    //listen for chatmessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage('User', msg))
    })
})

const PORT = process.env.PORT||3000 

server.listen(PORT,()=> console.log(`Server running on port ${PORT}`))


  