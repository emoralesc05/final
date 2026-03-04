document.getElementById("accessForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const code = document.getElementById("code").value.trim();
  const message = document.getElementById("message");

  message.textContent = "Validando...";

  try {
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = "Acceso concedido";
      window.location.href = "/panel.html";
    } else {
      message.textContent = "Acceso denegado";
    }

  } catch (err) {
    console.error(err);
    message.textContent = "Error de conexión";
  }
});