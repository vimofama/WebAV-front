const loginForm = document.querySelector("form");
const errorMessages = document.querySelector("#errorMessages");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://webav-api.onrender.com/api/auth/";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email.length === 0 || password.length === 0) {
    errorMessages.innerHTML = `<p>Los campos son obligatorios</p>`;
    return;
  }

  if (password.length < 6) {
    errorMessages.innerHTML = `<p>La contraseña debe tener al menos 6 caracteres</p>`;
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email, password }),
  };

  try {
    const resp = await fetch(url, requestOptions);
    const json = await resp.json();

    if (resp.ok) {
      localStorage.setItem("token", json.token);

      if (json.usuario.rol === "ADMIN_ROLE") {
        window.location = "/dashboard/";
      } else {
        window.location = "/";
      }
    } else {
      errorMessages.innerHTML = `<p>${json.msg}</p>`;
      console.log(` mensaje de error: ${json.msg}`);
    }
  } catch (error) {
    errorMessages.innerHTML = `<p>${JSON.stringify(error)}</p>`;
  }
});
