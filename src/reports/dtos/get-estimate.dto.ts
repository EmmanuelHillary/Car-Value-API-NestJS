import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude, isString, max } from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto{

    @IsString()
    make:string;

    @IsString()
    model: string;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(2000)
    @Max(2022)
    year:number;

    @Transform(({value}) => parseFloat(value))
    @IsLatitude()
    latitude:number;

    @Transform(({value}) => parseFloat(value))
    @IsLongitude()
    longitude:number;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage:number;

}