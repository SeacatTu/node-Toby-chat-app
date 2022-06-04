const path= require('path')
const http =require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter =require('bad-words')
const {generateMessage ,generateLocationMessage}= require('./utils/messages')
const { addUser, getUser, removeUser, getUserInRoom} = require('./utils/users')
const { isTypedArray } = require('util/types')
//terminal 
//1. npm init
//2. npm i express
//3. require path and set publicDictoryPath
//4. app use express and listen to port
//5. package.json setting start and dev
//6. npm i nodemon --save-dev
//7. test : npm run start & npm run dev


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDictoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDictoryPath))

//let count = 0

//server(emit) --> client(receive) - countUpdated
//client(emit) --> server(receive) - increment

io.on('connection',(socket)=>{
   console.log('New Socket io connection!')

   socket.on('join',({username , room},callback)=>{

   const {error, user} =  addUser({id:socket.id, username, room })
    if(error){
            return callback(error)
     }

    socket.join(user.room)
    socket.emit('message',generateMessage('Admin','Welcome') )
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users: getUserInRoom(user.room)
    })
    
    callback()

    //socket.emit, io.emit, socket.broadcast.emit
    //io.to.emit , socket.broadcast.to.emit

   })

   socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(message)){
           return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
      
   })

  socket.on('sendlocation',(coords,callback)=>{
    const user = getUser(socket.id)
      io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude} `))
      callback()
  })

   socket.on('disconnect',()=>{
       const user =removeUser(socket.id)
       if(user){
        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)
        })
       }
       
   })
//    socket.emit('countUpdated',count)
   
//    socket.on('increment',()=>{
//        count++
//     //  socket.emit('countUpdated',count)
//             io.emit('countUpdated',count)
//    })
})

server.listen(port, ()=>{
    console.log(`Server in up on Port ${port}!`)
})

