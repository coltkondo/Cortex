import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './Job';

export enum ApplicationStage {
  SAVED = 'saved',
  APPLIED = 'applied',
  SCREEN = 'screen',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  jobId!: number;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  job!: Job;

  @Column({ type: 'varchar', default: ApplicationStage.SAVED })
  stage!: string;

  @Column({ type: 'datetime', nullable: true })
  appliedDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  screenDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  interviewDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  offerDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
