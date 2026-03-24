import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CompanyStage {
  STARTUP = 'startup',
  SERIES_B = 'series_b',
  LATE_STAGE = 'late_stage',
  PUBLIC = 'public',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  company!: string;

  @Column({ type: 'varchar' })
  role!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  source?: string;

  @Column({ type: 'varchar', default: CompanyStage.SERIES_B })
  companyStage!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
