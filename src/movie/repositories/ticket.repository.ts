import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, IsNull, Repository } from 'typeorm';

import { Ticket } from '../entities/ticket.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class TicketRepository extends Repository<Ticket> {
  constructor(private dataSource: DataSource) {
    super(Ticket, dataSource.createEntityManager());
  }

  async setTicketUsed(userId: number, ticketId: number): Promise<Ticket> {
    const ticket = await this.findOne({
      where: { id: ticketId, user: { id: userId }, isUsed: false },
    });
    if (!ticket) {
      throw new NotFoundException();
    } else {
      await this.update({ id: ticketId }, { isUsed: true });
      return ticket;
    }
  }

  async getUsedTickets(userId: number): Promise<Ticket[]> {
    const tickets = await this.find({
      relations: { session: { movie: true }, user: true },
      where: { user: { id: userId }, isUsed: true },
    });
    return tickets;
  }

  async buyTickets(
    user: User,
    sessionId: number,
    amount: number,
  ): Promise<Ticket[]> {
    const [tickets, count] = await this.findAndCount({
      relations: { session: { movie: true } },
      where: { user: IsNull(), session: { id: sessionId } },
    });
    if (!tickets || count < amount) {
      throw new NotFoundException();
    } else {
      tickets.forEach((ticket) => (ticket.user = user));
      await this.save(tickets);
    }
    return tickets;
  }
}
