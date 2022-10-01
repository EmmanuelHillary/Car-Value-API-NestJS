import { Request, Response, NextFunction } from "express";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { UsersService } from "../users.service";
import { User } from "../users.entity";

declare global{
    namespace Express{
        interface Request{
            currentUser?:User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{

    constructor(private usersService:UsersService){}
    async use(request: Request, response: Response, next: NextFunction) {

        const { userId } = request.session || {};

        if ( userId ) {
            const user = await this.usersService.findOne({id:userId});

            request.currentUser = user;
        }
        
        next();
    }
}