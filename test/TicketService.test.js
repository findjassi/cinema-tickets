describe('TicketService.purchaseTickets', () => {
    describe('Validate account ID', () => {
        // It should throw error if account ID is a negative number

        // It should throw error if account ID is a string

        // It should not throw error if account ID is a positive number
    });
  
    describe('Validate types of tickets', () => {
        // It should throw error if invalid ticket type is requested

        // It should not throw error if valid ticket type is requested
    });

    describe('Validate maximum tickets purchase', () => {
        // It should throw error if more than 25 tickets are requested

        // It should not throw error if 25 or less tickets are requested
    });

    describe('Validate adult, child and infant ticket dependencies', () => {
        // It should throw error if Infant tickets are requested without an Adult ticket

        // It should throw error if Child tickets are requested without an Adult ticket

        // It should not throw error if Infant tickets are requested with an Adult ticket
        
        // It should not throw error if Child tickets are requested with an Adult ticket

        // It should throw error if Infant tickets are more than Adult tickets

        // It should not throw error if Infant tickets are less than or equal to Adult tickets

        // It should not throw error if only Adult tickets are requested
    });

    describe('Validate total cost of tickets', () => {
        // It should calculate correct total cost for requested tickets

        // It should not charge for the purchase of Infant tickets

        // It should price according to the ticket type - Adult: £25, Child: £15, Infant: £0
    });

    describe('Validate seat allocation', () => {
        // It should allocate correct number of seats for requested tickets

        // It should not allocate seats for Infant tickets
    });
    
    describe('Validate ticket purchase functionality', () => {
        // It should allow purchasing of multiple tickets'
        
        
        // It should reject if no tickets are requested
    });  
  });
  