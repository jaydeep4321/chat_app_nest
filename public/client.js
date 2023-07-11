//const socket = io()
const socket = io('http://localhost:3001', {
  transports: ['websocket'], // use WebSocket first, if available
  //transports: ["polling"]
  //transports: ["websocket", "polling"] // use WebSocket first, if available
});

let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

var form = document.getElementById('form');
var uploadImage = document.getElementById('file');
var showImage = document.getElementById('showImage');
// const inputElement = document.getElementById('inputElement');

var uname = localStorage.getItem('uname');
console.log(uname);
var room = localStorage.getItem('room');
console.log(room);

var st = document.getElementById('chat');
var st = document.getElementById('typing');

document.getElementById('h1').innerHTML = `Room -${room}`;

if (room) {
  socket.emit(
    'room',
    { user: uname, room: room, time: getTime() },
    async function (ack) {
      //console.log("chat-data:",ack);
      for (let i = 0; i <= ack.length; i++) {
        appendMessage(ack[i], 'incoming');
      }
    },
  );
} else {
  socket.emit('new-user-joined', { user: uname, time: getTime() });
}

textarea.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    //console.log(e.target.value);
    sendMessage({ message: e.target.value, room: room, user: uname });
  }
});

textarea.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') {
    socket.emit('typing', { room: room, user: uname });
  }
});

uploadImage.addEventListener('change', function (e) {
  var data = e.target.files[0];
  console.log(data);
  //alert("Image uploaded")
  e.target.value = '';
  readThenSendFile(data);
  // upload(data);
});

function leave() {
  alert('user leave.');
  socket.emit('leave-room', { user: uname, room: room, time: getTime() });
  location.href = '/';
}

function sendMessage(message) {
  console.log(message);
  let data = {
    time: getTime(),
    room: message.room,
    message: message.msg || message.message.trim(),
    user: message.user,
  };
  // Append
  appendMessage(data, 'outgoing');
  textarea.value = '';
  st.innerHTML = '';
  scrollToBottom();

  // Send to server
  socket.emit('send-chat', data);
}

function appendMessage(data, type) {
  console.log('appendmessage', data);
  let mainDiv = document.createElement('div');
  let className = type;
  mainDiv.classList.add(className, 'message');

  var markup;
  if (data.file && room == data.room) {
    if (data.fileName.split('.').pop() === 'pdf') {
      markup = `
      <img src="/pdf.png" width="100px"/>
      <div style="margin-left:auto; font-size: medium;">${data.fileName}</div>
      <button class="btn" onclick="downloadFile('${data.file}', '${data.fileName}')">
      <i class="fa fa-download"></i> Download
      </button>
      <div style="margin-left:auto; font-size: smaller;">${data.time}</div>
    `;
    } else if (data.fileName.split('.').pop() === 'csv') {
      markup = `
      <img src="/csv.png" width="100px"/>
      <div style="margin-left:auto; font-size: medium;">${data.fileName}</div>
      <button class="btn" onclick="downloadFile('${data.file}', '${data.fileName}')">
      <i class="fa fa-download"></i> Download
      </button>
      <div style="margin-left:auto; font-size: smaller;">${data.time}</div>
    `;
    } else {
      markup = `
      <img src=${data.file} width="200px"/>
      <div style="margin-left:auto; font-size: medium;">${data.fileName}</div>
      <button class="btn" onclick="downloadFile('${data.file}', '${data.fileName}')">
      <i class="fa fa-download"></i> Download
      </button>
      <div style="margin-left:auto; font-size: smaller;">${data.time}</div>
    `;
    }
  } else if (
    (type == 'outgoing' && room == data.room) ||
    (data.user == null && room == data.room)
  ) {
    markup = `
      <p>${data.message}</p>
      <div style="margin-left:auto; font-size: smaller;">${data.time}</div>
    `;
  } else {
    console.log('appendMessage time:', data);
    markup = `
      <p>${data.user} : ${data.message}</p>
      <div style="margin-left:auto; font-size: smaller;">${data.time}</div>
    `;
  }
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

function downloadFile(fileUrl, fileName) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.click();
}

function getTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes() <= 9 ? '0' + d.getMinutes() : d.getMinutes();
  if (h >= 0 && h < 12) {
    return h + ':' + m + ' am';
  } else {
    return h + ':' + m + ' pm';
  }
}

function readThenSendFile(data) {
  var reader = new FileReader();
  reader.onload = function (evt) {
    var file = {};
    console.log('In read...:', evt);
    file.username = uname;
    file.file = evt.target.result;
    file.fileName = data.name;
    file.time = getTime();
    file.room = room;
    file.size = data.size;
    // socket.emit('base64 file', file);
    socket.emit('upload', file);
  };
  //console.log("");
  reader.readAsArrayBuffer(data);
  //reader.readAsDataURL(data); //encoded
}

// Recieve messages

function upload(files) {
  // const data = e.target.files[0];
  socket.emit('upload', files[0]);
}

socket.on('user-joined', (data) => {
  //console.log("CLIENT:", data);
  appendMessage(data, 'incoming');
  scrollToBottom();
});
socket.on('user-joined-room', (data) => {
  console.log('CLIENT:', data);
  appendMessage(data, 'incoming');
  scrollToBottom();
});

socket.on('receive-chat', (payload) => {
  console.log('receive-chat:', payload);
  appendMessage(payload, 'incoming');
  scrollToBottom();
});

socket.on('welcome-to-room', (data) => {
  console.log('CLIENT:', data);
  //console.log(ack);
  appendMessage(data, 'incoming');
  scrollToBottom();
});

socket.on('left', (payload) => {
  console.log(payload);
  appendMessage(payload, 'incoming');
  scrollToBottom();
});

socket.on('typing', (data) => {
  console.log(data);
  st.innerHTML = data;
  setTimeout(() => {
    st.innerHTML = '';
  }, 3000);
});

// socket.on('base64 file', (payload) => {
//   console.log('file data:', payload);
//   appendMessage(payload, 'incoming');
//   scrollToBottom();
// });

socket.on('upload', (payload) => {
  console.log('file data:', payload);
  appendMessage(payload, 'incoming');
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

// const io = new Server(httpServer, {
//   maxHttpBufferSize: 1e8,
// });
