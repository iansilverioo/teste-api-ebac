/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {
  
  it.only('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
  })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
      }).should((response) => {
          expect(response.status).equal(200)
          expect(response.body).to.have.property('usuarios')
      })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.cadastrarUsuario('Ian Silvério' , 'iansilverio@gmail.com' , 'teste')
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        "email": "fulano@qa.com.br", 
        "password": "teste"
      },
      failOnStatusCode: false
    }).then((response) =>{
      cy.log(response.body.authorization)
      expect(response.body.message).to.equal('Email e/ou senha inválidos')
      expect(response.status).to.equal(401)
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario(faker.person.fullName() , faker.internet.email() , 'teste')
    .then(response => {
        let id = response.body._id
    cy.editarUsuario(id , faker.person.fullName() , faker.internet.email() , 'teste')
    .should((response) => {
        expect(response.status).equal(200)
        expect(response.body.message).equal('Registro alterado com sucesso')
    })
})
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario(faker.person.fullName() , faker.internet.email() , 'teste')
    .then(response => {
        let id = response.body._id
    cy.request({
          method: 'DELETE',
          url: '/usuarios/' + id,
      }).should(resp => {
          expect(resp.status).equal(200)
          expect(resp.body.message).equal('Registro excluído com sucesso')
   
      });
  });

});

})
