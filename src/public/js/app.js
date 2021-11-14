const socket = io();

const welcome = document.getElementById("welcome");
const enterRoom = welcome.querySelector("#enterRoom");
const room = document.getElementById("room");
const nickname = document.querySelector("#name");

room.hidden = true;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function checkNickName(nickNameInput) {
  const nickNameForm = welcome.querySelector("#name");
  const p = welcome.querySelector("#name p");
  p.innerText = `Your new nickname is '${nickNameInput}'`;
  nickNameForm.appendChild(p);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNickNameSubmit(event) {
  event.preventDefault();
  const nickNameInput = welcome.querySelector("#name > input");
  socket.emit("nickname", nickNameInput.value);
  checkNickName(nickNameInput.value);

  nickNameInput.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  // const nickNameInput = welcome.querySelector("#name input");

  const roomNameInput = enterRoom.querySelector("input");
  socket.emit("enter_room", roomNameInput.value, showRoom);
  roomName = roomNameInput.value; // 프론트 변수. showRoom에 들어가는 roomName
  // event 이름 text(다양한 이름 가능) , json(다양한 오브젝트)나 함수 등 다양한 arg 무제한,..
  // function은 마지막에 와야함(함수 없어도 잘되긴함)
  roomNameInput.value = "";
}
nickname.addEventListener("submit", handleNickNameSubmit);

enterRoom.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}(${newCount})`;
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}(${newCount})`;
  addMessage(`${left} left T_T`);
});
socket.on("new_message", addMessage); // (msg) => {addMessage(msg)} 와 동일함

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
