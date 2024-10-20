import { MAXIMUM_NUMBER_OF_TICKETS } from '../src/pairtest/Constants.js';
import TicketService from '../src/pairtest/TicketService.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');

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
        it('should throw error if more than MAXIMUM_NUMBER_OF_TICKETS tickets are requested', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', MAXIMUM_NUMBER_OF_TICKETS + 1);
            expect(() => ticketService.purchaseTickets(1, adultTicketRequest)).toThrow(InvalidPurchaseException);
        });

        it('should not throw error if MAXIMUM_NUMBER_OF_TICKETS or less tickets are requested', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', MAXIMUM_NUMBER_OF_TICKETS);
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
        it('should calculate the correct total cost for requested tickets', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
            const childTicketRequest = new TicketTypeRequest('CHILD', 3);

            ticketService.purchaseTickets(1, adultTicketRequest, childTicketRequest);

            expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(1, 95); // 2*25 + 3*15 = 95
        });

        it('should not charge for the purchase of Infant tickets', () => {
            const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
            const adultTicketRequest = new TicketTypeRequest('ADULT', 2);

            ticketService.purchaseTickets(1, infantTicketRequest, adultTicketRequest);

            expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(1, 50); // 2*0 + 2*25= 50
        });

        it('should price according to the ticket type - Adult: £25, Child: £15, Infant: £0', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const childTicketRequest = new TicketTypeRequest('CHILD', 1);
            const infantTicketRequest = new TicketTypeRequest('INFANT', 1);

            ticketService.purchaseTickets(1, adultTicketRequest, childTicketRequest, infantTicketRequest);

            expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(1, 40); // 1*25 + 1*15 + 1*0 = 40
        });
    });

    describe('Validate seat allocation', () => {
        it('should allocate the correct number of seats for requested tickets', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
            const childTicketRequest = new TicketTypeRequest('CHILD', 3);
            const infantTicketRequest = new TicketTypeRequest('INFANT', 1);

            ticketService.purchaseTickets(1, adultTicketRequest, childTicketRequest, infantTicketRequest);

            expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(1, 5); // 2 Adults + 3 Children = 5 seats (Infants don't need seats)
        });
        it('should not allocate seats for Infant tickets', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
            const infantTicketRequest = new TicketTypeRequest('INFANT', 2);

            ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest);

            expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(1, 2); // 2 Adults = 2 seats (Infants don't need seats)
        });
    });
    
    describe('Validate ticket purchase functionality', () => {
        it('should allow purchasing of multiple tickets', () => {
            const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
            const childTicketRequest = new TicketTypeRequest('CHILD', 1);

            expect(() => ticketService.purchaseTickets(1, adultTicketRequest, childTicketRequest)).not.toThrow();
        });

        it('should reject if no tickets are requested', () => {
            expect(() => ticketService.purchaseTickets(1)).toThrow(InvalidPurchaseException);
        });
    });  
  });
  