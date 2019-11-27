const bodyParser = require('body-parser'),
    http = require('http'),
    express = require('express'),
    chat = require('./Chat')
    socketio = require('socket.io');

const port = process.env.PORT || 3000,
    app = express(),
    server = http.createServer(app);
    io = socket.io(Server)

io.on('connection', function(socket){
  console.log('a user connected, socket: '+ socket.id )

  socket.on('userJoin', user =>{
    socket.user = user
    socket.broadcast.emit('userJoin', user)
  })

  socket.on('message', message =>{
    socket.broadcast.emit('message', message)
  })

  socket.on('disconnect', () => {
    if(socket.hasOwnProperty('user')){
      deleteUser(socket.user,err, confirm =>{
        if(err) throw err
      })
    }
  });
});






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/chat', chat);
app.use(express.static('public'));

Server.listen(PORT, () => console.log("Server is running on port: " + PORT))
