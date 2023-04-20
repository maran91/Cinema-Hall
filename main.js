const ticketType = {
  Discount: 1,
  Regular: 2,
  Student: 3,
};

const seats = [
  { id: 1, seatNr: 1, types: [ticketType.Discount] },
  { id: 2, seatNr: 2, types: [ticketType.Regular, ticketType.Discount] },
  { id: 3, seatNr: 3, types: [ticketType.Regular] },
  { id: 4, seatNr: 4, types: [ticketType.Discount, ticketType.Student] },
];

const tickets = [
  { ticketNum: 2, type: ticketType.Regular },
  { ticketNum: 2, type: ticketType.Discount },
];

/*
const seats = [
  { id: 1, seatNr: 1, types: [ticketType.Regular, ticketType.Discount, ticketType.Student] },
  { id: 2, seatNr: 2, types: [ticketType.Regular] },
  { id: 3, seatNr: 3, types: [ticketType.Student] },
];

const tickets = [{ ticketNum: 2, types: ticketType.Student }];


let seats = [
  { id: 1, seatNr: 1, types: [ticketType.Regular] },
  { id: 2, seatNr: 2, types: [ticketType.Regular] },
  { id: 3, seatNr: 3, types: [ticketType.Discount] },
];
const tickets = [
  { ticketNum: 1, types: ticketType.Regular },
  { ticketNum: 2, types: ticketType.Discount },
];


const seats = [{ id: 1, seatNr: 1, types: [ticketType.Regular] }];
const tickets = [{ ticketNum: 7, types: ticketType.Regular }];
*/

const matchTicketToSeat = (tickets, seats) => {
  if (seats.length < getTotalTicketsNumber(tickets)) {
    return "Error: There are more tickets then seats";
  }
  // Find tickets for single type seats
  const assignedSeats = findSingleChoiceSeats(tickets, seats);
  // Find tickets for seats with multible types
  const multibleChoiceMatches = findMultibleChoiceSeats(
    tickets,
    seats,
    assignedSeats
  );

  if (getTotalTicketsNumber(tickets) !== 0) {
    return "Error not enough seats!";
  }
  return multibleChoiceMatches;
};

const findSingleChoiceSeats = (tickets, seats) => {
  let assignedSeats = {};
  let seatsToDelete = [];
  seats
    .filter((seat) => seat.types.length < 2)
    .map((seat) => {
      tickets.map((ticket) => {
        if (seat.types.includes(ticket.type)) {
          if (ticket.ticketNum > 0) {
            if (assignedSeats[ticket.type] === undefined) {
              assignedSeats[ticket.type] = [seat.seatNr];
            } else {
              assignedSeats[ticket.type].push(seat.seatNr);
            }

            ticket.ticketNum--;
            seatsToDelete.push(seat.id);
          } else {
            return;
          }
        }
      });
    });
  seatsToDelete.reverse();
  seatsToDelete.map((item) => {
    seats.splice(item - 1, 1);
  });
  return assignedSeats;
};

const findMultibleChoiceSeats = (tickets, seats, assignedSeats) => {
  findAvailableTicketsForEachSeatAndSort(tickets, seats);
  findAvailableSeatsForEachTicketAndSort(tickets, seats);
  seats.map((seat) => {
    tickets.map((ticket) => {
      if (seat.types.includes(ticket.type)) {
        if (ticket.ticketNum > 0) {
          if (assignedSeats[ticket.type] === undefined) {
            assignedSeats[ticket.type] = [seat.seatNr];
          } else {
            assignedSeats[ticket.type].push(seat.seatNr);
          }
          ticket.ticketNum--;
        } else {
          return;
        }
      }
    });
  });
  return assignedSeats;
};

const findAvailableSeatsForEachTicketAndSort = (tickets, seats) => {
  tickets.map((ticket) => {
    let count = 0;
    seats.map((seat) => {
      if (seat.types.includes(ticket.type)) {
        count++;
      }
    });
    ticket["availableSeatsForThisTicket"] = count;
  });

  tickets.sort((a, b) => {
    if (a.availableSeatsForThisTicket > b.availableSeatsForThisTicket) {
      return 1;
    } else if (a.availableSeatsForThisTicket < b.availableSeatsForThisTicket) {
      return -1;
    } else {
      return 0;
    }
  });
  return tickets;
};

const findAvailableTicketsForEachSeatAndSort = (tickets, seats) => {
  seats.map((seat) => {
    let count = 0;
    seat.types.map((type) => {
      tickets.map((ticket) => {
        if (ticket.type === type) {
          count++;
        }
      });
    });
    seat["availableTicketsForSeats"] = count;
  });
  seats.sort((a, b) => {
    if (a.availableTicketsForSeats > b.availableTicketsForSeats) {
      return 1;
    } else if (a.availableTicketsForSeats < b.availableTicketsForSeats) {
      return -1;
    } else {
      return 0;
    }
  });
  return seats;
};

const getTotalTicketsNumber = (tickets) => {
  let totalTicketNum = 0;

  for (let i = 0; i < tickets.length; i++) {
    totalTicketNum += tickets[i].ticketNum;
  }
  return totalTicketNum;
};

console.log(matchTicketToSeat(tickets, seats));
