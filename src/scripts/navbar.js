const btnLogin = document.getElementById("loginButton");
const btnLogout = document.getElementById("logoutButton");

btnLogin.addEventListener("click", () => {
  window.location.href = "/login/";
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  // Redirigir o realizar cualquier otra acción necesaria después de cerrar sesión
  window.location.href = "/"; // Redireccionar a la página principal, por ejemplo
  // Otros pasos para finalizar la sesión
});

// Verificar si existe el token en localStorage para mostrar u ocultar los botones
const token = localStorage.getItem("token");
if (token) {
  btnLogin.style.display = "none";
  btnLogout.style.display = "block";
} else {
  btnLogin.style.display = "block";
  btnLogout.style.display = "none";
}
