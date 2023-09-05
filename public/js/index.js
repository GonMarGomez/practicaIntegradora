const socket = io(); // Conectar con el servidor de Socket.io

let user;
let chatBox = document.querySelector('#chatBox')
Swal.fire({
    title: 'Identificate',
    text: 'Ingresa tu nombre de usuario',
    input: 'text',
    inputValidator : (value)=>{
        return !value && 'Necesitas escribir un nombre de usuario para continuar!'
    
    },
    allowOutsideClick: false
}).then(result =>{
    user = result.value
    socket.emit('userConnect', result.value)
});

chatBox.addEventListener('keypress', e=>{
    if (e.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message',{
                user: user,
                message: chatBox.value
            });
        }
        chatBox.value = '';
    }
});
socket.on('messagesLogs', data => {
    let log = document.querySelector('#messagesLogs');
    let messages = '';
    data.forEach(message => {
        messages += `${message.user}: ${message.message} </br>`
    });

    log.innerHTML = messages;
    
    socket.on('newUser', data => {
        Swal.fire({
            text: `${data} se ha unido al chat`,
            toast: true,
            position: 'top-right'
        });
})
});