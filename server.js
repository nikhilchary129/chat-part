const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const server = http.createServer(app);
const format = require("./utilites/formatmsg")
// Set the view engine to EJS
app.set("view engine", "ejs");

// Initialize Socket.IO and attach it to the HTTP server with CORS configuration
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://your-deployed-frontend-url.com'],
        methods: ['GET', 'POST'], // Add any additional HTTP methods you need
    },
});


// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Include your routes (assuming routes.js contains your route definitions)
const route = require("./routes/routes.js");
app.use(route);
let user = {}
// Socket.IO connection event
io.on('connection', (socket) => {

    socket.on('joinroom', (room, username) => {
        socket.join(room)
        socket.username = username
        socket.room=room
        if (!user[room]) {
            user[room] = []
        }
        user[room].push(socket.username)
        //console.log(user[room])
        const text = username + ' has joined the server '
        const time = format()
        io.to(room).emit('message', { msg: text, username: 'chatbot', time });
        io.to(room).emit('allusers', user[room])

    })



    socket.on('disconnect', () => {
        if (socket.room && user[socket.room]) {
            console.log('in disconnect',socket.room, user[socket.room])
            const time = format();
            const s = `${socket.username} has left the room`;
            user[socket.room] = user[socket.room].filter(
                (element) => element !== socket.username
            );
            
            io.to(socket.room).emit('message', { msg: s, username: 'chatbot', time });



            io.to(socket.room).emit('allusers', user[socket.room]);
            console.log(user[socket.room])
        }
    })



    socket.on('sendmsg', ({ msg, username }) => {


        const time = format()
      //  console.log(socket.room, msg, username)

        io.to(socket.room).emit('message', { msg, username, time })

    })
    //socket for signalling
    socket.on('form',(form)=>{

    })
    socket.on('answer',(answer)=>{ 

    })
    socket.on('ice',(ice)=>{
        
    })

});
console.log(user)
// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
