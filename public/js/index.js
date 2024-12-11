const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresá el usuario para identificarte",
  inputValidator: (value) => {
    return !value && "Por favor, ingresé su nombre de usuario";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("newUser", user);
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let messagesLogs = document.getElementById("messageLogs");
  let messages = "";

  data.forEach((messageLog) => {
    const messageClass = messageLog.user === user ? "text-end" : "text-start";
    messages += `<div class="${messageClass}"><strong>${messageLog.user}</strong>: ${messageLog.message}</div>`;
  });

  messagesLogs.innerHTML = messages;
});

socket.on("newUser", (data) => {
  Swal.fire({
    text: `Se conectó ${data}`,
    toast: true,
    position: "top-right",
    timer: 2000,
    showConfirmButton: false,
  });
});

socket.on("user-disconnect", (data) => {
  Swal.fire({
    text: `${data} se desconectó`,
    toast: true,
    position: "top-right",
    timer: 2000,
    showConfirmButton: false,
  });
});
