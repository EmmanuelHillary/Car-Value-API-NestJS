import  { NestInterceptor, UseInterceptors, CallHandler, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

interface ClassContructor{
    new (...args:any[]): {}
}

export function Serialize(dto:ClassContructor){
    return UseInterceptors(new UserSerializerInterceptor(dto))
}

export class UserSerializerInterceptor implements NestInterceptor{
    constructor(private dto:any){}
    intercept(context:ExecutionContext, next:CallHandler):Observable<any>{
        // This scope runs before the requests is executed by the request handler (i.e in the controller/urlpath)
        return next.handle().pipe(
            map((data:any)=>{
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues:true
                })
            })
        )
    }

}