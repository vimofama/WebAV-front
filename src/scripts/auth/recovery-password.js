const form = document.querySelector("form");
const errorMessages = document.querySelector("#errorMessages");
const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/usuarios/"
  : "https://webav-api.onrender.com/api/usuarios/";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const password2 = document.querySelector("#password2").value.trim();

  if (password !== password2) {
    errorMessages.innerHTML = "Las contraseñas no coinciden";
    return;
  }

  if (password.length < 6 || password2.length < 6) {
    errorMessages.innerHTML = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  };

  try {
    const res = await fetch(url + `${email}`);
    const json = await res.json();

    if (res.ok) {
      const uid = json.usuario.uid;
      const request = await fetch(url + `${uid}`, requestOptions);
      const response = await request.json();

      if (request.ok) {
        window.location.href = "/login";
      } else {
        errorMessages.innerHTML = response.msg || "Recuperar contraseña fallo";
      }
    } else {
      errorMessages.innerHTML = json.msg || "Recuperar contraseña fallo";
    }
  } catch (error) {
    errorMessages.innerHTML = "Recuperar contraseña fallo";
  }
});
