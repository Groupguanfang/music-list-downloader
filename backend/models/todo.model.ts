import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Todo {
  /** The todo id */
  @PrimaryGeneratedColumn()
  id: number

  /** Todo content */
  @Column()
  content: string

  /** todo create time */
  @CreateDateColumn()
  createdAt: Date

  /** todo update time */
  @UpdateDateColumn()
  updatedAt: Date
}
