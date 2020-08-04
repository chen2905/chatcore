const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
//Get username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
console.log(username,room)
const socket =io()

//join chatroom

socket.emit('joinRoom',{username,room})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
//message from server
socket.on('message',message => {
    console.log(message)
    outputMessage(message)

    //scroll down
 chatMessages.scrollTop = chatMessages.scrollHeight

})

//Message submit
chatForm.addEventListener('submit', e=> {
    e.preventDefault();
    // Get message text
    const msg = e.target.elements.msg.value
    //Emit message to server
    socket.emit('chatMessage',msg)
    //clear input
    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
})

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div')
    
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username}<span> ${message.time}</span>
    <p class="text">
    ${message.text}
    </p>`
    chatMessages.appendChild(div)
} 
//output room name to DOM
function outputRoomName(room){
    roomName.innerText = room
}
//ouptput user list of the room to the DOM
function outputUsers(users){
    console.log(`users:j ${users[0].username}`)
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}