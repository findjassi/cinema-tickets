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
}
