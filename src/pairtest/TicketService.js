import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import { ERROR_MESSAGES, MAXIMUM_NUMBER_OF_TICKETS, TICKET_PRICES } from './Constants.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    this.#validateAccountId(accountId);
    this.#validateTicketTypeRequests(ticketTypeRequests);
    this.#validateMaximunNumberOfTickets(ticketTypeRequests);
    this.#validateAdultChildInfantTickets(ticketTypeRequests);

    // Calculate total price
    const { totalCost, totalSeats } = this.#calculateTotalCostandSeats(ticketTypeRequests);

    // Make payment
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalCost);

    // Reserve seats
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, totalSeats);
  }

  // Validate account ID
  #validateAccountId(accountId) {
    if (typeof accountId !== 'number' || accountId < 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
    }
  }

  // Validate types of tickets
  #validateTicketTypeRequests(ticketTypeRequests) {
    const invalidTicketTypeRequest = ticketTypeRequests.some((ticketTypeRequest) => {
      return !(ticketTypeRequest instanceof TicketTypeRequest);
    });

    if (invalidTicketTypeRequest || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    }
  }

  // Validate maximum tickets purchase
  #validateMaximunNumberOfTickets(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + ticketTypeRequest.getNoOfTickets();
    }, 0);

    if (totalTickets > MAXIMUM_NUMBER_OF_TICKETS) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.MAXIMUM_NUMBER_OF_TICKETS_EXCEEDED);
    }
  }

  // Validate adult, child and infant tickets
  #validateAdultChildInfantTickets(ticketTypeRequests) {
    const numberOfAdultTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + (ticketTypeRequest.getTicketType() === 'ADULT' ? ticketTypeRequest.getNoOfTickets() : 0);
    }, 0);
    
    if(numberOfAdultTickets === 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.NO_ADULT_TICKETS_REQUESTED);
    }

    const numberOfInfantTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + (ticketTypeRequest.getTicketType() === 'INFANT' ? ticketTypeRequest.getNoOfTickets() : 0);
    }, 0);
    
    if (numberOfInfantTickets > 0 && numberOfInfantTickets > numberOfAdultTickets) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.MORE_INFANT_TICKETS_THAN_ADULT_TICKETS_REQUESTED);
    } 
  }

  // Calculate total cost and seats
  #calculateTotalCostandSeats(ticketTypeRequests) {
    let totalCost = 0;
    let totalSeats = 0;
    
    ticketTypeRequests.forEach((ticketTypeRequest) => {
      const ticketType = ticketTypeRequest.getTicketType();
      const noOfTickets = ticketTypeRequest.getNoOfTickets();

      totalCost += TICKET_PRICES[ticketType] * noOfTickets;
      
      if (ticketType !== 'INFANT') {
        totalSeats += noOfTickets;
      }
    });

    return { totalCost, totalSeats }
  }
}
