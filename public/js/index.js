// Configuramos el socket del lado del cliente
const socket = io(); // Hacemos referencia a socket.io

let user;

let chatBox = document.getElementById("chatBox");

// Alerta para ingresar datos

Swal.fire({
title: "Identificate",
input: "text",
text: "Ingresá el usuario para identificarte",
inputValidator: (value) => {
  return !value && "Por favor, ingresé su nombre de usuario"
},
allowOutsideClick: false
}).then ((result) => {
  user = result.value;
  console.log(user);

  //Se envía el user al server

  socket.emit("newUser", user);
})

chatBox.addEventListener("keyup", (event) => {
  if(event.key === "Enter") {
 if(chatBox.value.trim().length > 0) {
  socket.emit("message", { user: user, message: chatBox.value })
  chatBox.value = "";
 }
  }
})

// recibir los mensajes del chat actualizados

socket.on("messageLogs", (data) => {
  let messagesLogs = document.getElementById("messageLogs");
  let messages = "";

  data.forEach((messageLog) => {
    messages = messages + `${messageLog.user} dice: ${messageLog.message}</br>`
  });

  messagesLogs.innerHTML= messages;
})

socket.on("newUser", (data) => {
  Swal.fire({
    text:`se conecto ${data}`,
    toast: true,
    position: "top-right",
    timer: 2000,
  });


    })


socket.on("user-disconnect", (data) => {
    swal.fire({
      text: `${data} se desconectó`,
      toast: true,
      position: "top-right",
      timer: 2000,
      showConfirmButton: false,  })
});