// darkmode.js

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggleDarkMode");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Guardar preferencia en localStorage para persistir modo oscuro
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  // Al cargar la página, revisar preferencia guardada
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
