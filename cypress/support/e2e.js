import "./commands";

// Menangani uncaught exceptions agar test tidak gagal karena error non-kritis
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
