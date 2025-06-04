document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('error');

  let apiUrl = null;

  if (window.electronAPI) {
    window.electronAPI.onConfig((config) => {
      apiUrl = config.apiUrl;
      form.querySelector('button[type="submit"]').disabled = false;
    });
  } else {
    console.warn("⚠️ electronAPI no está disponible en window");
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!apiUrl) {
      errorBox.textContent = "No se recibió API_URL del sistema aún. Espera unos segundos.";
      return;
    }

    const email = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
      const reslogin = await fetch(apiUrl + "/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const datalogin = await reslogin.json();

      if (datalogin.status === 200) {
        const token = datalogin.content.jwttoken;
        localStorage.setItem('authToken', token);
        window.location.href = 'views/dashboard.html';
      } else {
        errorBox.textContent = "Error en login: Verifica tu usuario y contraseña.";
        throw new Error("Login incorrecto");
      }
    } catch (err) {
      console.error(err);
      errorBox.textContent = "Error en login: Verifica tu usuario y contraseña.";
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
