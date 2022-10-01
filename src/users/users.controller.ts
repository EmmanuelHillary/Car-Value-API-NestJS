import { Post, Controller, Body, Get, UseGuards, Delete, Patch, Query, Param, Session, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/users.serializer'
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/sign-in.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@Serialize(UserDTO)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(private userRepo:UsersService,
                private authService:AuthService
                ){}

    @Post('/signup')
    async createUser(@Body() body:CreateUserDto, @Session() session:any){
        const user = await this.authService.signup(body.username, body.email, body.password)
        session.userId = user.id
        return user
    }

    @Get('/signin')
    async signIn(@Body() body:SigninDto, @Session() session:any){
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Get('/signout')
    signOut(@Session() session:any){
        session.userId = null
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user:User|string){
        return user
    }


    @Get("/:id")
    async findUser(@Param("id") id:string):Promise<any>{
        const user = await this.userRepo.findOne({id:parseInt(id)})
        if (!user){
            throw new NotFoundException("user not found")
        }
        return user
    }

    @Get()
    findAllUsers(@Query() query:Pick<UpdateUserDto, "username" | "email">){
        return this.userRepo.find(query)
    }

    @Patch("/:id")
    updateUser(@Param("id") id:string, @Body() body:UpdateUserDto ){
        return this.userRepo.update(parseInt(id), body)
    }

    @Delete("/:id")
    deleteUser(@Param("id") id:string){
        return this.userRepo.remove(parseInt(id))
    }
}
