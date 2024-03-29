const form = document.querySelector("form");
const errorMessages = document.querySelector("#errorMessages");
const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/usuarios"
  : "https://webav-api.onrender.com/api/usuarios";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const password = formData.get("password");
  const password2 = formData.get("password2");

  if (password.length < 6 && password2.length < 6) {
    errorMessages.innerHTML = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  if (password !== password2) {
    errorMessages.innerHTML = "Las contraseñas no coinciden";
    return;
  }

  const requestOptions = {
    method: "POST",
    body: JSON.stringify({
      nombre,
      correo: email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(url, requestOptions);
    const json = await res.json();

    if (json.msg) {
      errorMessages.innerHTML = json.msg;
      return;
    }

    if (res.ok) {
      window.location.href = "/login";
    } else {
      errorMessages.innerHTML = json.msg;
    }
  } catch (error) {
    errorMessages.innerHTML = error;
  }
});
