import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './Job';

export enum ContentType {
  FIT_SCORE = 'fit_score',
  BULLETS = 'bullets',
  COVER_LETTER = 'cover_letter',
  INTERVIEW_PREP = 'interview_prep',
}

@Entity('generated_content')
export class GeneratedContent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  jobId!: number;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  job!: Job;

  @Column({ type: 'varchar' })
  contentType!: string;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
