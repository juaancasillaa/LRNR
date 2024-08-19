describe('Homepage Tests', () => {
    beforeEach(() => {
      cy.visit('/Home');
    });
  
    it('should display the logo image', () => {
      cy.get('img[alt="LRNR logo"]').should('be.visible');
    });
  
    it('should display the heading text', () => {
      cy.contains('Your guided path to programming enlightenment').should('be.visible');
    });
  
    it('should navigate to quiz generation on button click', () => {
      cy.get('button').contains('BEGIN JOURNEY').click();
      cy.url().should('include', '/quiz-generation');
    });
  
    it('should display the boxes with correct content', () => {
      cy.get('.box').should('have.length', 3);
      cy.contains('Personalized Quizzes').should('be.visible');
      cy.contains('Rewarding').should('be.visible');
      cy.contains('Personal SME').should('be.visible');
    });
  });