describe("Login Flow (mocked)", () => {
  beforeEach(() => {
    cy.visit("/login");

    // Mock API login sukses
    cy.fixture("user").then((user) => {
      cy.intercept("POST", "/api/login", {
        statusCode: 200,
        body: { user: { email: user.email } },
      }).as("loginRequest");

      // Mock API user data setelah login
      cy.intercept("GET", "/api/users/me", {
        statusCode: 200,
        body: { email: user.email },
      }).as("getUser");
    });
  });

  // Skenario: Memastikan form login muncul
  it("renders login form", () => {
    cy.get('input[placeholder="Masukkan email"]').should("exist");
    cy.get('input[placeholder="Masukkan password"]').should("exist");
    cy.get("button").contains("Login").should("exist");
  });

  // Skenario: Memastikan error muncul ketika field kosong
  it("shows error when fields are empty", () => {
    cy.get("button").contains("Login").click();

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Login failed");
    });
  });

  // Skenario: Memastikan login berhasil dengan credentials benar
  it("allows user to login with correct credentials", () => {
    cy.fixture("user").then((user) => {
      cy.get('input[placeholder="Masukkan email"]').type(user.email);
      cy.get('input[placeholder="Masukkan password"]').type(user.password);

      cy.get("button").contains("Login").click();

      // Tunggu request login selesai
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      // Tunggu redirect (simulate home page request)
      cy.wait("@getUser");

      // Pastikan sudah ke halaman utama
      cy.url().should("eq", Cypress.config().baseUrl + "/");
      // atau lebih aman:
      // cy.url().should("not.include", "/login");
    });
  });

  // Skenario: Memastikan error muncul dengan credentials salah
  it("shows error with wrong credentials", () => {
    cy.get('input[placeholder="Masukkan email"]').type("wrong@mail.com");
    cy.get('input[placeholder="Masukkan password"]').type("wrongpass");
    cy.get("button").contains("Login").click();

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Login failed");
    });
  });
});
