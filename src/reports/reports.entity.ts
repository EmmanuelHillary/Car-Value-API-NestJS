import { User } from 'src/users/users.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Report{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    price:number

    @Column()
    make:string

    @Column()
    model: string

    @Column()
    year: number

    @Column()
    longitude: number

    @Column()
    latitude:number

    @Column()
    mileage:number

    @Column({ default:false })
    approve:boolean

    @ManyToOne(()=>User, (user)=>user.reports)
    user:User

}