// frontend

const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('ding.mp3');
var isDark = (localStorage.getItem('darkMode') != null) ? localStorage.getItem('darkMode') : true;
const theme = 'dark';
const body = document.querySelector('body');
body.style.backgroundImage = `url('./wallpaper-${theme}.jpg')`;
const toggleButton = document.getElementById('toggle');

const toggleDarkMode = () => {
    isDark = !isDark;
    const sendContainerCss = document.getElementById('send-container');
    const toggleDarkBtnCss = document.getElementById('toggle');
    const darkIconBtnCss = document.getElementById('darkSymbol');
    const sendBtnCss = document.getElementById('send');
    const lightBg = 'rgba(255, 255, 255, 0.4)';
    const lightColor = 'rgb(12, 12, 12)';
    const darkBg = 'rgba(0, 0, 0, 0.4)';
    const darkColor = 'white';
    localStorage.setItem('darkMode', isDark);
    if (!isDark) {
        sendContainerCss.style.backgroundColor = lightBg;
        sendContainerCss.style.color = lightColor;
        toggleDarkBtnCss.style.backgroundColor = lightBg;
        toggleDarkBtnCss.style.color = lightColor;
        darkIconBtnCss.innerText = 'light_mode';
        sendBtnCss.style.color = lightColor;
        messageInput.style.color = lightColor;
        messageInput.classList.add('light');
        messageInput.classList.remove('dark');
        sendBtnCss.addEventListener('mouseover', () => {
            sendBtnCss.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'
        });
        sendBtnCss.addEventListener('mouseleave', () => {
            sendBtnCss.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
        });
        sendBtnCss.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        body.style.backgroundImage = `url('./wallpaper-light.jpg')`;
        body.style.transition = 'all 300ms';
        document.querySelectorAll('.username').forEach((element) => {
            element.style.color = lightColor;
        });
        document.querySelectorAll('.message').forEach((element) => {
            element.style.color = lightColor;
            element.style.backgroundColor = lightBg;
        });
        document.querySelectorAll('.nav-head').forEach((element) => {
            element.style.color = lightColor;
            element.style.backgroundColor = lightBg;
        });
    } else {
        sendContainerCss.style.backgroundColor = darkBg;
        sendContainerCss.style.color = darkColor;
        toggleDarkBtnCss.style.backgroundColor = darkBg;
        toggleDarkBtnCss.style.color = darkColor;
        darkIconBtnCss.innerText = 'dark_mode';
        messageInput.style.color = darkColor;
        messageInput.classList.add('dark');
        messageInput.classList.remove('light');
        sendBtnCss.addEventListener('mouseover', () => {
            sendBtnCss.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        });
        sendBtnCss.addEventListener('mouseleave', () => {
            sendBtnCss.style.backgroundColor = 'rgba(255, 255, 255, 0.081)'
        });
        sendBtnCss.style.color = darkColor;
        sendBtnCss.style.backgroundColor = 'rgba(255, 255, 255, 0.081)';
        body.style.backgroundImage = `url('./wallpaper-dark.jpg')`;
        body.style.transition = 'all 300ms';
        document.querySelectorAll('.username').forEach((element) => {
            element.style.color = darkColor;
        });
        document.querySelectorAll('.message').forEach((element) => {
            element.style.color = darkColor;
            element.style.backgroundColor = darkBg;
        });
        document.querySelectorAll('.nav-head').forEach((element) => {
            element.style.color = darkColor;
            element.style.backgroundColor = darkBg;
        });
    }
}

toggleButton.addEventListener('click', toggleDarkMode);
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

const showMessage = (usernametxt, messagetxt, position) => {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add(position);
    messageBubble.classList.add('message-bubble');
    const usernameText = document.createElement('span');
    usernameText.innerText = usernametxt;
    usernameText.classList.add('username');
    usernameText.classList.add(position);
    const msg = document.createElement('div');
    msg.classList.add('message');
    msg.innerText = messagetxt;

    messageBubble.appendChild(usernameText);
    messageBubble.appendChild(msg);

    messageContainer.append(messageBubble);
    if (position == 'left') {
        audio.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message != "") {
        showMessage('You', message, 'right');
        socket.emit('send', message);
    }
    messageInput.value = '';
})

let username = prompt("Enter your name:");
while (username === null) {
    username = prompt("Enter your name:");
}

socket.emit('new-user-joined', username);

socket.on('user-joined', data => {
    append(`${data} joined the chat`, 'center');
})

socket.on('receive', data => {
    showMessage(data.name, data.message, 'left');
});

socket.on('leave', data => {
    append(`${data.name} left the chat`, 'center');
});

socket.on('disconnect', () => {
    append('You left the chat', 'center');
});