import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('edit_logs')
export class EditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  occurrenceId: string;

  @Column({ type: 'jsonb', nullable: true })
  initialData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  modifiedData: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  editor: {
    name?: string;
    email?: string;
  };

  @Column({ nullable: true })
  reasonForEdit: string;
}
