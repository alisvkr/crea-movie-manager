import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Ticket } from '../../movie/entities/ticket.entity';
import { Movie } from '../../movie/entities/movie.entity';
import { MovieSession } from '../../movie/entities/movieSession.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column('simple-array')
  roles: string[];

  @Column()
  isAccountDisabled: boolean;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
