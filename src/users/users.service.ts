import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './users.entity'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo:Repository<User>){}

    create(username:string, email:string, password:string){
        const user = this.repo.create({ username, email, password })
        return this.repo.save(user)
    }

    findOne(attrs:Partial<Pick<User, "id" | "username"| "email" >>){
        if (attrs.id === null){
            throw new BadRequestException("User cannot be null")
        }
        return this.repo.findOne({where:attrs})
    }

    find(attrs:Partial<Pick<User, "id" | "username" | "email">>){
        return this.repo.find({where:attrs})
    }

    async update(id:number, attrs:Partial<User>){
        const user = await this.findOne({id});
        if (!user){
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id:number){
        const user = await this.repo.findOne({where:{id}});
        if (!user){
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user)
    }
}
