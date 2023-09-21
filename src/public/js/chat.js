const socket = io()

let username;
Swal.fire({
    title: 'Identifícate',
    input: "text",
    text: 'Ingresa un nombre de usuario',
    inputValidator: (value) =>{
        return !value && "Es obligatorio introducir un input"
    },
    allowOutSideClick : false,
  }).then((result) => {
    username = result.value
    socket.emit("new-user", username);
  })

  const chatInput = document.getElementById("chat-input");
  chatInput.addEventListener("keyup", (event) => {
    if(event.key ==="Enter") {
        const inputMessage = chatInput.value
       if(inputMessage.trim().length > 0){
        socket.emit("chat-message", {username, message: inputMessage})
        }    
    }
  })

  const messagesPanel = document.getElementById("messages-panel");
  socket.on("messages", (data) => {
    let messages = ""
    data.forEach((info) => {
        messages +=`<b>${info.username}</b>:${info.message} </br>`
    })
    messagesPanel.innerHTML = messages;

  })

  socket.on("new-user", (username) => {
    Swal.fire({
        title: `${username} se ha unido al chat`,
        toast: true,
        position:"top-end"

    })

  })