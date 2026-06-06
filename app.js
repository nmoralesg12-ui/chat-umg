// ============================
// ✅ LOGIN (CORREGIDO)
// ============================
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const response = await fetch("https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Username: username,
        Password: password
      })
    });

    // ✅ VER HEADERS EN CONSOLA (para debug)
    console.log("HEADERS:", [...response.headers.entries()]);

    // ✅ Leer body (por si acaso)
    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      console.log("No JSON body");
    }

    console.log("BODY:", data);

    // ✅ 1. Intentar obtener token desde headers
    let token = response.headers.get("Authorization") ||
                response.headers.get("authorization");

    // ✅ Si viene como "Bearer xxxxx"
    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    // ✅ 2. Si no hay en headers, buscar en body
    if (!token) {
      token = data.token || data.Token || data.accessToken || data.jwt;
    }

    // ✅ Validar token
    if (!token) {
      document.getElementById("resultado").innerText =
        "No se recibió token ❌ (revisa F12)";
      return;
    }

    // ✅ Guardar token
    localStorage.setItem("token", token);

    document.getElementById("resultado").innerText =
      "Login exitoso ✅";

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    document.getElementById("resultado").innerText =
      "Error en login ❌";
  }
}


// ============================
// ✅ ENVIAR MENSAJE
// ============================
async function enviarMensaje() {
  const mensaje = document.getElementById("mensaje").value;
  const token = localStorage.getItem("token");
  const username = document.getElementById("username").value;

  if (!mensaje) {
    alert("Escribe un mensaje");
    return;
  }

  if (!token) {
    alert("Primero debes iniciar sesión");
    return;
  }

  try {
    const response = await fetch("https://backcvbgtmdesa.azurewebsites.net/api/Mensajes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        Cod_Sala: 0,
        Login_Emisor: username,
        Contenido: mensaje
      })
    });

    const text = await response.text();
    console.log("MENSAJE RESPONSE:", text);

    if (!response.ok) {
      document.getElementById("resultado").innerText =
        "Error del servidor ❌";
      return;
    }

    document.getElementById("resultado").innerText =
      "Mensaje enviado ✅";

  } catch (error) {
    console.error("ERROR ENVIO:", error);
    document.getElementById("resultado").innerText =
      "Error de conexión ❌";
  }
}