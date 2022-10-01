import { Expose, Transform } from "class-transformer";

export class ReportResponseDto{
    
    @Expose()
    id:number;
    
    @Expose()
    make:string;
    
    @Expose()
    model:string;
    
    @Expose()
    year:number;

    @Expose()
    price:number;

    @Expose()
    mileage:number;

    @Expose()
    longitude: number;

    @Expose()
    latitude:number;

    @Expose()
    approve:boolean

    @Transform(({obj})=>obj.user.id)
    @Expose()
    userId:number
}