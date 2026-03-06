const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let rooms = {}

io.on("connection", socket => {

 socket.on("createRoom", ()=>{

  let code = Math.floor(1000 + Math.random()*9000).toString()

  rooms[code] = {
   players:[socket.id],
   numbers:{},
   turn:null,
   started:false
  }

  socket.join(code)
  socket.emit("roomCreated", code)

 })

 socket.on("joinRoom", code=>{

  let room = rooms[code]
  if(!room) return

  room.players.push(socket.id)
  socket.join(code)

  io.to(code).emit("bothJoined")

 })

 socket.on("setNumber", ({room, number})=>{

  let r = rooms[room]
  r.numbers[socket.id] = number

  if(Object.keys(r.numbers).length === 2){

   r.turn = r.players[0]
   r.started = true

   io.to(room).emit("startGame", r.turn)
  }

 })

 socket.on("guess", ({room, number})=>{

  let r = rooms[room]
  if(socket.id !== r.turn) return

  let opponent = r.players.find(p=>p!==socket.id)
  let secret = r.numbers[opponent]

  setTimeout(()=>{

   if(number == secret){

    io.to(room).emit("winner", socket.id)

   }else{

    let result = number > secret ? "Lower" : "Higher"

    socket.emit("result", result)

    r.turn = opponent

    io.to(room).emit("turn", opponent)
   }

  },3000)

 })

})

server.listen(3000, ()=>{
 console.log("Server running on port 3000")
})