// cypress/support/commands.js
Cypress.Commands.add("loginFormSuccess", () => {
  cy.fixture("user").then((user) => {
    cy.get('input[placeholder="Masukkan email"]').type(user.email);
    cy.get('input[placeholder="Masukkan password"]').type(user.password);

    // Dispatch Redux thunk sukses langsung
    cy.window().then((win) => {
      if (win.store) {
        win.store.dispatch({
          type: "auth/login/fulfilled",
          payload: { email: user.email },
        });
      }
    });

    cy.get("button").contains("Login").click();
  });
});
