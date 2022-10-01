 import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude, isString, max } from "class-validator";

export class ReportsDto{

    @IsString()
    make:string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price:number;

    @IsNumber()
    @Min(2000)
    @Max(2022)
    year:number;


    @IsLatitude()
    latitude:number;

    @IsLongitude()
    longitude:number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage:number;

}