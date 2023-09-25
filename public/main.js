
const socket = io();
socket.on('message', ({ msg, username, time }) => {

    display(msg, username, time.time)
})
const dropdownContent = document.getElementById("users");
const toggleButton = document.getElementById("toggleDropdown");

toggleButton.addEventListener("click", (event) => {
    // Prevent the click event from propagating to the window
    event.stopPropagation();
    dropdownContent.classList.toggle("hidden");
});
window.addEventListener('click', () => {

    dropdownContent.classList.add('hidden')
})
const roomdiv = document.getElementById('room-name')
const url = window.location.href
const hrefs = new URL(url)
const room = hrefs.searchParams.get('room')
const username = hrefs.searchParams.get("username");

socket.emit('joinroom', room, username);
// console.log(room)
// roomdiv.innerHTML = room
socket.emit('newuser', username)

//const userexists=[]
const userslist = document.getElementById('users')

socket.on('allusers', (user) => {
    //  console.log('Received all users:', user);
    userslist.innerHTML = ''
    user.forEach(element => {
        // console.log(element)
        const li = document.createElement('li')
        li.innerHTML = `<p >  ${element} </p>`
        userslist.appendChild(li)
    });
})



const form = document.getElementById('chat-form');
const chat = document.querySelector('.chat-messages')
console.log(chat)
console.log(form)

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(username)

    const msg = e.target.elements.msg.value
    console.log(msg)

    socket.emit('sendmsg', { msg, username })
    console.log(msg, username)
    e.target.elements.msg.value = ''


})

function display(mes, username, time,side) {
    const myusername = hrefs.searchParams.get("username");
    let classname='textmsg'
    if(username===myusername) {
      classname='right'
    } 
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<div class=${classname}> <p class="from">
    ${username} ${time}
 </p>   <p class="text">
       ${mes}
    </p> </div> `
  
    document.querySelector('.chat-messages').appendChild(div)
   
    chat.scrollTop = chat.scrollHeight

}