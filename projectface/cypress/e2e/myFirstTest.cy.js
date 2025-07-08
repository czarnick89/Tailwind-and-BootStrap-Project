describe('login suite', () => {
  it('login page loads if logged out', () => {
    cy.visit('http://127.0.0.1:5173/'); // can visit site
    cy.get('div.login-container').should('contain', 'Login to Workout Tracker'); // login container header text is loading
    cy.get('input.form-control').should('have.length', 2); // there are two inputs
    cy.get('button.btn-primary').should('contain', 'Login'); // there is a log in button
  })

  it('login with testuser2 then logout', () => {
    cy.visit('http://127.0.0.1:5173/'); // visit site
    cy.get('input.form-control').first().type('testuser2'); // type in username
    cy.get('input.form-control').eq(1).type('sTRongPW34$#'); //type in password
    cy.get('button.btn-primary').click() //click the log in button
    cy.get('button.btn-outline-secondary').should('contain', 'Logout'); // there is a log out button
    cy.get('button.btn-outline-secondary').click() //click the log out button
    cy.get('div.login-container').should('contain', 'Login to Workout Tracker'); // login container header text is loading
  })

})