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
        it('should throw error if more than 25 tickets are requested', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 26);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should not throw error if 25 or less tickets are requested', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 25);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest)).not.toThrow();
        });
    });

    describe('Validate adult, child and infant ticket dependencies', () => {
        it('should throw error if Infant tickets are requested without an Adult ticket', () => {
            const infantTicketRequest = new TicketTypeRequest('INFANT', 1);
            expect(() => ticketService.purchaseTickets(1, infantTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should throw error if Child tickets are requested without an Adult ticket', () => {
            const childTicketRequest = new TicketTypeRequest('CHILD', 1);
            expect(() => ticketService.purchaseTickets(1, childTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should not throw error if Infant tickets are requested with an Adult ticket', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const infantTicketRequest = new TicketTypeRequest('INFANT', 1);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest)).not.toThrow();
        });

        it('should not throw error if Child tickets are requested with an Adult ticket', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const childTicketRequest = new TicketTypeRequest('CHILD', 1);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest, childTicketRequest)).not.toThrow();
        });

        it('should throw error if Infant tickets are more than Adult tickets', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should not throw error if Infant tickets are less than or equal to Adult tickets', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
            const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest)).not.toThrow();
        });

        it('should not throw error if only Adult tickets are requested', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 3);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest)).not.toThrow();
        });
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
  