// Obtener referencias a los elementos del DOM
const chatButton = document.getElementById("chatButton");
const exitButton = document.getElementById("exitButton");
const userListBody = document.getElementById("userListBody");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const submitButton = document.getElementById("submitButton");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/usuarios/"
  : "https://webav-api.onrender.com/api/usuarios/";

// Función para mostrar el modal
function showModal() {
  modal.style.display = "block";
}

// Función para cerrar el modal
function closeModal() {
  modal.style.display = "none";
}

// Función para llenar el modal con la información del usuario
function fillModalWithUserData(user) {
  const nombreInput = document.getElementById("nombre");
  const correoInput = document.getElementById("correo");
  const rolSelect = document.getElementById("rol");
  const estadoInput = document.getElementById("estado");

  // Llenar los campos del modal con la información del usuario
  nombreInput.value = user.nombre;
  correoInput.value = user.correo;
  estadoInput.value = user.estado;
  rolSelect.value = user.rol;

  // Mostrar el modal
  showModal();
}

// Función para cargar usuarios desde la API
async function loadUsers() {
  try {
    const resp = await fetch(url);
    const data = await resp.json();

    data.usuarios.forEach((user) => {
      if (user.estado === false) {
        return;
      }
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="border p-3">${user.nombre}</td>
                    <td class="border p-3">${user.correo}</td>
                    <td class="border p-3">${user.rol}</td>
                    <td class="border p-3 flex justify-around">
                        <button class="pencil-btn h-8 w-8 bg-violet-500 hover:bg-violet-700 text-violet-50 font-bold rounded">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="trash-btn h-8 w-8 bg-violet-500 hover:bg-violet-700 text-violet-50 font-bold rounded">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
      userListBody.appendChild(row);

      const pencilBtn = row.querySelector(".pencil-btn");
      pencilBtn.addEventListener("click", async () => {
        localStorage.setItem("uid", user.uid);
        try {
          const resp = await fetch(url + `${user.correo}`);
          const userData = await resp.json();
          fillModalWithUserData(userData.usuario);
        } catch (error) {
          console.error("Error al obtener información del usuario:", error);
        }
      });

      const trashBtn = row.querySelector(".trash-btn");
      const token = localStorage.getItem("token");
      trashBtn.addEventListener("click", async () => {
        try {
          const resp = await fetch(url + `${user.uid}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-token": token,
            },
          });

          if (resp.ok) {
            row.remove();
          } else {
            console.error("Error al eliminar el usuario:", resp.status);
          }
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

// Event listeners
chatButton.addEventListener("click", () => {
  window.location.href = "/chat";
});

exitButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/"; // Redirigir a la página principal
});

closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const nombreInput = document.getElementById("nombre").value;
  const rolSelect = document.getElementById("rol").value;

  const userID = localStorage.getItem("uid");

  try {
    const resp = await fetch(url + `${userID}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: nombreInput,
        rol: rolSelect,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.ok) {
      localStorage.removeItem("uid");
      // Cerrar el modal después de la actualización exitosa
      closeModal();

      // Recargar la lista de usuarios
      userListBody.innerHTML = "";
      loadUsers();
    } else {
      localStorage.removeItem("uid");
      console.error("Error al actualizar el usuario:", resp.status);
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
  }
});

// Cargar usuarios al cargar la página
loadUsers();
