describe('Création d\'alerte', () => {

  beforeEach(() => {

    // Mock API
    cy.intercept('GET', '**/alert/mails', {
      statusCode: 200,
      body: [
      { id: 1, mail: 'test@example.com', userId: 1, isVerified: true }
    ]}).as('getMailAlerts');

    cy.intercept('GET', '**/profile', {
      statusCode: 200,
      body: [
      {
          "username": "toto",
          "mail": "toto@gmail.com",
          "last_connexion": "2026-02-22T08:17:55.504Z",
          "firstname": "toto",
          "lastname": "tutu",
          "avatar": "https://lh3.googleusercontent.com/a/ACg8ocIprUEdgRc6rYhKWwGvb4gcwf6w-DuKO9YferQGzOfk33pU0II=s96-c"
      }
    ]}).as('getProfile');

    cy.intercept('GET', '**/auth/expiration', { 
      statusCode: 200,
      body: true 
    }).as('checkAuth');

    cy.intercept('GET', '**/public/aleas/category', [
      {
        category_name: 'Naturel',
        alea_id: 1,
        alea_name: 'EARTHQUAKE',
        alea_label: 'Séisme'
      }
    ]).as('getAleas');

    cy.intercept('GET', '**/public/criteria', []).as('getCriteria');
    cy.intercept('POST', '**/alert/create', { id: 1, name: 'Test Alert' }).as('createAlert');

    cy.intercept('POST', '**/alert/mail/create', { mail: 'test@gmail.com' }).as('createMailAlert');

    cy.visit('/dashboard/alert/new', {
      onBeforeLoad(win) {
        localStorage.setItem('auth-token', 'fake-jwt-token');
      }
    });
  });

  it('affiche des erreurs si le formulaire est incomplet', () => {
    cy.contains('button', 'Créer').click();
    cy.get('app-toastr').should('contain', 'Vous devez donner un nom à votre alerte');
    cy.get('app-toastr button').click(); // Close the toast

    cy.get('input[formControlName="name"]').type('Alerte Test');
    cy.contains('button', 'Créer').click();
    cy.get('app-toastr').should('contain', "Vous devez selectionner au moins un type d'aléa");
    cy.get('app-toastr button').click(); // Close the toast

    cy.contains('p', 'Séisme').click();
    cy.contains('button', 'Créer').click();
    cy.get('app-toastr').should('contain', "Vous devez selectionner au moins une personne");
    cy.get('app-toastr button').click(); // Close the toast

    cy.get('input[type="checkbox"][id^="mail-"]').check();

    cy.get('button[data-cy="create-alert"]').click();
    cy.get('#endalert-title').should('contain', 'Alerte enregistrée avec succès !');
  });

  it('permet de tracer ou de sélectionner une zone', () => {
    
    cy.get('input[formControlName="name"]').type('Alerte Test Zone');
    cy.contains('p', 'Séisme').click();
    cy.get('input[type="checkbox"][id^="mail-"]').check();
    
    // The map is a leaflet map within #map-new-area. 
    // Tracing a zone using Geoman usually involves clicking on the map.
    cy.contains('button', 'Tracer une zone à surveiller').click();
    
    // Simulate drawing a polygon
    cy.get('#map-new-area')
      .click(300, 300)
      .click(300, 400)
      .click(400, 400)
      .click(400, 300)
      .click(300, 300); // Close the polygon
    
    // Verify that the drawing succeeded and the button has changed
    cy.get('button[data-cy="edit-shape"]').should('be.visible');
    cy.get('button[data-cy="delete-shape"]').should('be.visible');
    cy.get('button[data-cy="select-country"]').should('not.exist');
    cy.get('button[data-cy="draw-shape"]').should('not.exist');
    
    // Edit shape
    cy.get('button[data-cy="edit-shape"]').click();
    cy.get('button[data-cy="alert-detail"]').should('be.visible');
    cy.get('button[data-cy="full-map"]').should('not.be.visible');
    
    cy.get('button[data-cy="alert-detail"]').click();
    // Delete shape
    cy.get('button[data-cy="delete-shape"]').click();
    cy.get('button[data-cy="edit-shape"]').should('not.exist');
    cy.get('button[data-cy="delete-shape"]').should('not.exist');
    cy.get('button[data-cy="select-country"]').should('be.visible');
    cy.get('button[data-cy="draw-shape"]').should('be.visible');
    
    // Select Country
    cy.get('button[data-cy="select-country"]').click();
    
    cy.get('#map-new-area .leaflet-interactive:nth-child(10)').click(); //Select Brésil
    cy.get('[data-cy="other-country"]').click();
    cy.get('#map-new-area .leaflet-interactive:nth-child(5)').click(); //Select Bénin
  });

  it('ajoute une adresse mail', () => {
    cy.get('button[data-cy="add-mail"]').click();
    cy.get('input[data-cy="invited-mail"]').type('test@gmail.com');
    cy.get('button[data-cy="invite"]').click();
    cy.get('app-toastr').should('contain', "Une invitation à rejoindre votre équipe a été envoyée");
    cy.get('app-toastr').should('contain', "test@gmail.com");
  });

});