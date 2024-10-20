import TicketService from '../src/pairtest/TicketService.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

describe('TicketService.purchaseTickets', () => {
    let ticketService;

    beforeEach(() => {
        ticketService = new TicketService();
    });

    describe('Validate account ID', () => {
        const validTicketRequest = new TicketTypeRequest('ADULT', 1);

        it('should throw error if account ID is a negative number', () => {
            expect(() => ticketService.purchaseTickets(-1, validTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should throw error if account ID is a string', () => {
            expect(() => ticketService.purchaseTickets('123', validTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should not throw error if account ID is a positive number', () => {
            expect(() => ticketService.purchaseTickets(1, validTicketRequest)).not.toThrow();
        });
    });
  
    describe('Validate types of tickets', () => {
        it('should throw error if invalid ticket type is requested', () => {
            expect(() => new TicketTypeRequest('INVALID_TYPE', 1)).toThrow(TypeError);
        });

        it('should not throw error if valid ticket type is requested', () => {
            const validTicketRequest = new TicketTypeRequest('ADULT', 1);
            expect(() => ticketService.purchaseTickets(1, validTicketRequest)).not.toThrow();
        });

        it('should throw error if no tickets are requested', () => {
            expect(() => ticketService.purchaseTickets(1)).toThrow(InvalidPurchaseException);
        });
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
  