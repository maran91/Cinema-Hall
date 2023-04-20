// ### seat types ###
// A regular ticket
// B discounted ticket
// C student ticket

const seats = [
  { id: 1, seatNr: 1, seatTypes: ["B"] },
  { id: 2, seatNr: 2, seatTypes: ["A", "B"] },
  { id: 3, seatNr: 3, seatTypes: ["A"] },
  { id: 4, seatNr: 4, seatTypes: ["B", "C"] },
];

const tickets = [
  { ticketNum: 2, seatTypes: "A" },
  { ticketNum: 2, seatTypes: "B" },
];

/*
const seats = [
  { id: 1, seatNr: 1, seatTypes: ["A", "B", "C"] },
  { id: 2, seatNr: 2, seatTypes: ["A"] },
  { id: 3, seatNr: 3, seatTypes: ["C"] },
];

const tickets = [{ ticketNum: 2, seatTypes: "C" }];


let seats = [
  { id: 1, seatNr: 1, seatTypes: ["A"] },
  { id: 2, seatNr: 2, seatTypes: ["A"] },
  { id: 3, seatNr: 3, seatTypes: ["B"] },
];
const tickets = [
  { ticketNum: 1, seatTypes: "A" },
  { ticketNum: 2, seatTypes: "B" },
];


const seats = [{ id: 1, seatNr: 1, seatTypes: ["A"] }];
const tickets = [{ ticketNum: 7, seatTypes: "A" }];
*/

const matchTicketToSeat = (tickets, seats) => {
  if (seats.length < getTotalTicketsNumber(tickets)) {
    return "Error: There are more tickets then seats";
  }
  // Find tickets for single type seats
  const stricktMatches = findSingleChoiceSeats(tickets, seats);
  // Find tickets for seats with multible types
  const multibleChoiceMatches = findMultibleChoiceSeats(tickets, seats);

  if (getTotalTicketsNumber(tickets) !== 0) {
    return "Error not enough seats!";
  }
  return [...stricktMatches, ...multibleChoiceMatches];
};

const findSingleChoiceSeats = (tickets, seats) => {
  let occupiedSeats = [];
  let seatsToDelete = [];
  seats
    .filter((seat) => seat.seatTypes.length < 2)
    .map((seat) => {
      tickets.map((ticket) => {
        if (seat.seatTypes.includes(ticket.seatTypes)) {
          if (ticket.ticketNum > 0) {
            occupiedSeats.push({
              seatNum: seat.seatNr,
              seatType: seat.seatTypes,
              ticketType: ticket.seatTypes,
            });
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
  return [...occupiedSeats];
};

const findMultibleChoiceSeats = (tickets, seats) => {
  let occupiedSeats = [];
  findAvailableTicketsForEachSeatAndSort(tickets, seats);
  findAvailableSeatsForEachTicketAndSort(tickets, seats);
  seats.map((seat) => {
    tickets.map((ticket) => {
      if (seat.seatTypes.includes(ticket.seatTypes)) {
        if (ticket.ticketNum > 0) {
          occupiedSeats.push({
            seatNum: seat.seatNr,
            seatType: seat.seatTypes,
            ticketType: ticket.seatTypes,
          });
          ticket.ticketNum--;
        } else {
          return;
        }
      }
    });
  });
  return occupiedSeats;
};

const findAvailableSeatsForEachTicketAndSort = (tickets, seats) => {
  tickets.map((ticket) => {
    let count = 0;
    seats.map((seat) => {
      if (seat.seatTypes.includes(ticket.seatTypes)) {
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
    seat.seatTypes.map((type) => {
      tickets.map((ticket) => {
        if (ticket.seatTypes === type) {
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
