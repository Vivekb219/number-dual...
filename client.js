const socket = io()

let room
let myTurn = false

function createRoom(){
 socket.emit("createRoom")
}

function joinRoom(){
 let code = document.getElementById("roomCode").value
 socket.emit("joinRoom", code)
 room = code
}

socket.on("roomCreated", code=>{
 room = code
 document.getElementById("menu").style.display="none"
 document.getElementById("game").style.display="block"
 document.getElementById("room").innerText=code
})

socket.on("bothJoined", ()=>{
 document.getElementById("menu").style.display="none"
 document.getElementById("game").style.display="block"
 document.getElementById("room").innerText=room
})

function sendNumber(){
 let num = Number(document.getElementById("secret").value)
 socket.emit("setNumber", {room:room, number:num})
 document.getElementById("setup").innerText="Waiting for opponent..."
}

socket.on("startGame", turn=>{

 document.getElementById("setup").style.display="none"
 document.getElementById("play").style.display="block"

 if(socket.id===turn){
  myTurn=true
  document.getElementById("turn").innerText="Your Turn"
 }else{
  document.getElementById("turn").innerText="Opponent Turn"
 }

})

function guess(){

 if(!myTurn) return

 let number = Number(document.getElementById("guess").value)

 socket.emit("guess", {room:room, number:number})

 document.getElementById("guess").value=""

}

socket.on("result", r=>{
 document.getElementById("result").innerText=r
})

socket.on("turn", turn=>{

 if(socket.id===turn){
  myTurn=true
  document.getElementById("turn").innerText="Your Turn"
 }else{
  myTurn=false
  document.getElementById("turn").innerText="Opponent Turn"
 }

})

socket.on("winner", id=>{

 if(socket.id===id)
  alert("You Win 🎉")
 else
  alert("You Lose")

 location.reload()

})