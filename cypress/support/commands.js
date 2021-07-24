// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
Cypress.Commands.add('logOut', () => {
  cy.get('.UserMenu-user-menu-button')
    .click();

  cy.get('.UserMenu-user-menu-logout')
    .click();
});

Cypress.Commands.add('logIn', (user) => {
  cy.visit(`${Cypress.env('ROOT_URL')}/auth/login`);

  cy.get('#normal_login_email')
    .focus()
    .type(user.email);

  cy.get('#normal_login_password')
    .focus()
    .type(user.password)
    .blur();

  cy.wait(100);

  cy.get('button[type="submit"]')
    .click();
});

Cypress.Commands.add('goToFactsPage', () => {
  cy.get(`a.logo`).click();
});

Cypress.Commands.add('addTopic', (name) => {
  cy.get('.SearchInput input[type="search"]')
    .type(name, { delay: 100 });

  cy.get('.SearchInput button')
    .click();

  cy.get('.AddStatementModal .StatementInput textarea')
    .focus();

  cy.get('.AddStatementModal .StatementInput button')
    .click();

  cy.wait(100);
});

Cypress.Commands.add('addStatement', (name, connectionType = 'supporting') => {
  cy.get(`.ExplorerPage-inputs .StatementInput--${connectionType} textarea`)
    .type(name, { delay: 100 });

  cy.get(`.ExplorerPage-inputs .StatementInput--${connectionType} button[type="submit"]`)
    .click();

  return cy.get(`.StatementsList--${connectionType}`)
    .contains(name)
    .should('exist');

  // check black dot of parent
});

Cypress.Commands.add('getStatementItemByName', (name) =>
  cy.get(`.StatementItem`)
    .contains(name)
    .parentsUntil(`.StatementItem`)
    .last()
    .parent()
);


Cypress.Commands.add('gotToStatement', (name) => {
  cy.getStatementItemByName(name)
    .click();

  cy.get('.StatementsList').should('have.length', 3);
});

Cypress.Commands.add('openSuggestionDialog', (name) => {
  cy.getStatementItemByName(name)
    .trigger('mouseover')
    .find('.StatementItem-focus-button')
    .click();
});

Cypress.Commands.add('addSuggestion', (targetName, name) => {
  cy.openSuggestionDialog(targetName);

  cy.get(`textarea[placeholder="${targetName}"]`)
    .type(name, { delay: 100 });

  cy.get(`.StatementItem-heading button[type="submit"]`)
    .click();

  cy.getStatementItemByName(name)
    .should('exist');

  // TODO check parent has white dot

  cy.closeDialog();
});

Cypress.Commands.add('closeDialog', () => {
  cy.get(`.underlay`)
    .click();
});

Cypress.Commands.add('addRetractionSuggestion', (targetName, name) => {
  cy.openSuggestionDialog(targetName);

  cy.get(`.SuggestionGuide textarea`)
    .type(name, { delay: 100 });

  cy.get(`.StatementItem-heading button[type="submit"]`)
    .click();

  cy.get('.StatementsList--suggestion').contains('retraction requested')
    .should('exist');

  cy.closeDialog();
});

Cypress.Commands.add('acceptSuggestion', (name) => {
  cy.clickScoreButton(name);
});

Cypress.Commands.add('checkStatementScore', (name, score) => {
  cy.getStatementItemByName(name)
    .should('contain', name);

  cy.getStatementItemByName(name)
    .find('.ScoreButton-score')
    .should('contain', score);
});

Cypress.Commands.add('checkScore', (credits, overall) => {
  cy.get('.voting-credit').should('have.text', credits);
  cy.get('.overall-score').should('have.text', overall);
});

Cypress.Commands.add('clickScoreButton', (statement) => {
  const statementItem = cy.getStatementItemByName(statement);
  statementItem.find('button.ScoreButton').click();
  cy.wait(5000);
});
