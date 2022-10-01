import { Report } from 'src/reports/reports.entity';
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import {  Exclude } from 'class-transformer'

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column()
    email:string;

    @Column({default:false})
    admin:boolean

    @Column()
    password:string;

    @OneToMany(()=>Report, (report)=>report.user)
    reports: Report[];

    @AfterInsert()
    logInsert(){
        console.log('Inserted User with ID', this.id)
    };

    @AfterUpdate()
    logUpdate(){
        console.log('Updated User with ID', this.id)
    };

    @AfterRemove()
    logRemove(){
        console.log("Removed User with ID", this.id)
    };
}