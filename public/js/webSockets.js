const socket = io();

let user;
let chatBox = document.querySelector("#chatBox");

Swal.fire({
  title: "Identifícate",
  input: "text",
  text: "Ingresa el usuario para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "¡Necesitas escribir un nombre de usuario para continuar!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  socket.emit("userConnect", result.value);
});

chatBox.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (chatBox.value.trim().length > 0) {
      console.log(chatBox.value);
      socket.emit("message", {
        user: user,
        message: chatBox.value,
      });
    }
    chatBox.value = "";
  }
});

socket.on("messagesLogs", (data) => {
  let log = document.querySelector("#messagesLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user}: ${message.message} </br>`;
  });

  log.innerHTML = messages;
});

socket.on("newUser", (data) => {
  console.log('SOY EL NUEVO CONECTADO')
  Swal.fire({
    text: `${data} se ha unido al chat`,
    toast: true,
    position: "top-right",
  });
});



