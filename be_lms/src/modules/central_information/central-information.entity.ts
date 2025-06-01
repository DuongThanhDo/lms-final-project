import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('central_information')
export class CentralInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  address: string;

  @Column('text')
  description: string;
}
