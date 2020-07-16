const path = require('path')
const http = require('http')
const express = require('express')
const socketio= require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
//set static folder
app.use(express.static(path.join(__dirname,'public')))

io.on('connection',socket =>{
    // Welcome current user
    //message to the user only
    socket.emit('message','Welcome to ChatCord')

    //message to all the users except the user
    socket.broadcast.emit('message','A user has joined the chat')

    //runs when client disconnects
    socket.on('disconnect', ()=> {
        io.emit('message', 'A user has left the chat')
    })

    //listen for chatmessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message', msg)
    })
})

const PORT = process.env.PORT||3000 

server.listen(PORT,()=> console.log(`Server running on port ${PORT}`))


  