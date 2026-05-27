/// <reference types="cypress" />

describe("Testes da Funcionalidade Catálogo de Livros", () => {
  let token;
  beforeEach(() => {
    cy.geraToken("admin@biblioteca.com", "admin123").then((tkn) => {
      token = tkn;
    });
  });
  it("GET - Deve listar livros com filtros e paginação", () => {
    cy.api({
      method: "GET",
      url: "books",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });
  it("GET - Deve obter detalhes de um livro específico", () => {
    cy.api({
      method: "GET",
      url: "books/50",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.book).to.have.property("id");
      expect(response.body.book).to.have.property("title");
      expect(response.body.book).to.have.property("author");
      expect(response.body.book).to.have.property("category");
      expect(response.body.book).to.have.property("available_copies");
    });
  });
  it("POST - Deve cadastrar um novo livro com sucesso", () => {
    let titleId = `sergio${Date.now()}titleId`;
    cy.api({
      method: "POST",
      url: "/books",
      headers: { Authorization: token },
      body: {
        title: titleId,
        author: "Autor de Testes",
        category: "Categoria de Testes",
        available_copies: 5,
      },
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.equal("Livro criado com sucesso.");
    });
  });
  it("POST -  Deve rejeitar livro com dados inválidos", () => {
    cy.api({
      method: "POST",
      url: "/books",
      headers: { Authorization: token },
      body: {
        title: "",
        author: "",
        category: "",
        available_copies: 10,
      },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.equal(400);
    });
  });
  it("PUT - Deve atualizar um livro previamente cadastrado", () => {
    let titleId = `sergio${Date.now()}titleId`;
    cy.api({
      method: "POST",
      url: "/books",
      headers: { Authorization: token },
      body: {
        title: titleId,
        author: "Autor de Teste",
        category: "Categoria de Teste",
        available_copies: 5,
      },
    }).then((response) => {
      cy.api({
        method: "PUT",
        url: `/books/${response.body.book.id}`,
        headers: { Authorization: token },
        body: {
          title: "Livro Atualizado",
          author: "Autor Atualizado",
          category: "Categoria Atualizada",
          available_copies: 10,
        },
      }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal("Livro atualizado com sucesso.");
      });
    });
  });

  it("PUT - Deve atualizar um livro com sucesso - De forma dinâmica ", () => {
    let titleId = `sergio${Date.now()}titleId`;
    cy.api({
      method: "POST",
      url: "/books",
      headers: { Authorization: token },
      body: {
        title: titleId,
        author: "Autor de Teste",
        category: "Categoria de Teste",
        available_copies: 5,
      },
    }).then((response) => {
      cy.api({
        method: "PUT",
        url: `/books/${response.body.book.id}`,
        headers: { Authorization: token },
        body: {
          title: "Livro Atualizado Dinâmico",
          author: "Autor Atualizado",
          category: "Categoria Atualizada",
          available_copies: 10,
        },
      }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal("Livro atualizado com sucesso.");
      });
    });
  });

  it.skip("DELETE - Deve deletar um liv  ro previamente cadastrado", () => {
    cy.api({
      method: "DELETE",
      url: "/books/55",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.equal("Livro deletado com sucesso.");
    });
  });
});
