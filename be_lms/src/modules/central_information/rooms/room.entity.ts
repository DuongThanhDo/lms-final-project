import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  capacity: number;
}
