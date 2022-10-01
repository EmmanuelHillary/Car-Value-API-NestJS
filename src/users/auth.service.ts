import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { User } from './users.entity';

// using scrypt ==> using promisify to turn it to a promise callback function
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{

    constructor(private usersService:UsersService){}

    async signup(username:string, email:string, password:string){
        const usernames = await this.usersService.find({username:username})
        const emails = await this.usersService.find({email:email})  
        if (usernames.length){
            throw new BadRequestException('Username already exists.')
        }
        if (emails.length){
            throw new BadRequestException("Email already exists.")
        }

        // Hashing password logic
        // creating a salt
        const salt = randomBytes(8).toString('hex');
        // creating the hash joining the salt and the password
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // creating the full hashed password
        const hashed_password = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(username, email, hashed_password)
        return user
    }

    async signin(email:string, password:string){
        const user = await this.usersService.findOne({username:email}) || await this.usersService.findOne({email:email})
        if (user === {} as User || !user || undefined || null){
            throw new NotFoundException("Invalid username or password.")
        }
        const [salt, storedHash] = user.password.split(".")
        const hash = (await scrypt(password, salt, 32)) as Buffer
        if (storedHash !== hash.toString('hex')){
            throw new BadRequestException("Invalid username or password.")
        }
        return user
    }



}