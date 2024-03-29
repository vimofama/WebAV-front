import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://webav-api.onrender.com/api/auth/";

let usuario = null;
let socketServer = null;

// Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");

const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "/login";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.nombre;
  await conectarSocket();
};

const conectarSocket = async () => {
  socketServer = io("/", {
    withCredentials: true,
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socketServer.on("connect", () => {
    console.log("Sockets online");
  });

  socketServer.on("disconnect", () => {
    console.log("Sockets offline");
  });

  socketServer.on("recibir-mensajes", dibujarMensajes);

  socketServer.on("usuarios-activos", (payload) => {
    dibujarUsuarios(payload);
  });

  socketServer.on("mensaje-privado", dibujarMensajesPrivado);
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";
  //<span class="text-sm text-gray-500">${uid}</span>
  usuarios.forEach(({ nombre, uid }) => {
    usersHtml += `
                        <li class="flex items-center justify-between border-b border-gray-200 py-2">
                            <div>
                                <h5 class="text-green-500">${nombre}</h5>
                            </div>
                        </li>
                    `;
  });

  ulUsuarios.innerHTML = usersHtml;
};

const dibujarMensajes = (mensajes = []) => {
  let mensjaesHtml = "";
  mensajes.forEach(({ de, mensaje }) => {
    mensjaesHtml += `
                        <li class="border-b border-gray-200 py-2">
                            <p class="text-blue-500 font-semibold">${de.nombre}:</p>
                            <p>${mensaje}</p>
                        </li>
                    `;
  });

  ulMensajes.innerHTML = mensjaesHtml;
  ulMensajes.scrollTop = ulMensajes.scrollHeight;
};

const dibujarMensajesPrivado = (payload) => {
  const { de: nombre, mensaje } = payload;

  let mensjaesHtml = `
                        <li class="border-b border-gray-200 py-2">
                            <p class="text-blue-500 font-semibold">${nombre}:</p>
                            <p>${mensaje}</p>
                        </li>
                    `;

  ulMensajes.innerHTML = mensjaesHtml;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;

  if (keyCode !== 13) {
    return;
  }
  if (mensaje.length === 0) {
    return;
  }

  socketServer.emit("enviar-mensaje", { mensaje, uid });
  txtMensaje.value = "";
  txtUid.value = "";
});

const main = async () => {
  // Validar JWT
  await validarJWT();
};

main();
