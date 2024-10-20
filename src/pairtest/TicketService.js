import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

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

  #validateMaximunNumberOfTickets(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      return total + ticketTypeRequest.getNoOfTickets();
    }, 0);

    if (totalTickets > 25) {
      throw new InvalidPurchaseException('Maximum number of tickets exceeded');
    }
  }

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
}
