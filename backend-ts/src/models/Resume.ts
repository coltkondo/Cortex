import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  filename!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  experienceSection?: string;

  @Column({ type: 'text', nullable: true })
  skillsSection?: string;

  @Column({ type: 'text', nullable: true })
  educationSection?: string;

  @Column({ type: 'text', nullable: true })
  projectsSection?: string;

  @CreateDateColumn()
  uploadedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
