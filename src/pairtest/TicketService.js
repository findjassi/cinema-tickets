import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  #ticketPrices = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0
  };

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
      throw new InvalidPurchaseException('Invalid account ID');
    }
  }

  // Validate types of tickets
  #validateTicketTypeRequests(ticketTypeRequests) {
    const invalidTicketTypeRequest = ticketTypeRequests.some((ticketTypeRequest) => {
      return !(ticketTypeRequest instanceof TicketTypeRequest);
    });

    if (invalidTicketTypeRequest || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('Invalid ticket type request');
    }
  }

  // Validate maximum tickets purchase
  #validateMaximunNumberOfTickets(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + ticketTypeRequest.getNoOfTickets();
    }, 0);

    if (totalTickets > 25) {
      throw new InvalidPurchaseException('Maximum number of tickets exceeded');
    }
  }

  // Validate adult, child and infant tickets
  #validateAdultChildInfantTickets(ticketTypeRequests) {
    const numberOfAdultTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + (ticketTypeRequest.getTicketType() === 'ADULT' ? ticketTypeRequest.getNoOfTickets() : 0);
    }, 0);
    
    if(numberOfAdultTickets === 0) {
      throw new InvalidPurchaseException('No adult tickets requested');
    }

    const numberOfInfantTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + (ticketTypeRequest.getTicketType() === 'INFANT' ? ticketTypeRequest.getNoOfTickets() : 0);
    }, 0);
    
    if (numberOfInfantTickets > 0 && numberOfInfantTickets > numberOfAdultTickets) {
      throw new InvalidPurchaseException('More infant tickets than adult tickets requested');
    } 
  }

  // Calculate total cost and seats
  #calculateTotalCostandSeats(ticketTypeRequests) {
    let totalCost = 0;
    let totalSeats = 0;
    
    ticketTypeRequests.forEach((ticketTypeRequest) => {
      const ticketType = ticketTypeRequest.getTicketType();
      const noOfTickets = ticketTypeRequest.getNoOfTickets();

      totalCost += this.#ticketPrices[ticketType] * noOfTickets;
      
      if (ticketType !== 'INFANT') {
        totalSeats += noOfTickets;
      }
    });

    return { totalCost, totalSeats }
  }
}
