import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './users.entity'
import { UpdateUserDto } from "./dto/update-user.dto"
import { NotFoundException } from "@nestjs/common"
import { SigninDto } from './dto/sign-in.dto'

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      find: (attrs:Partial<Pick<User, "id" | "username"| "email" >>) => {
        return Promise.resolve([{id:attrs.id||1, username:attrs.username||"TheH", email:attrs.email||"h@mail.com", password:"password"}as User])
      },
      findOne: (attrs:Partial<Pick<User, "id" | "username"| "email" >>) => {
          return Promise.resolve({id:attrs.id||1, username:attrs.username||"TheH", email:attrs.email||"h@mail.com", password:"password"}as User)
      }
    }
    fakeAuthService = {
      signin: (email:string, password:string) => {
        return Promise.resolve({id:1, username:"user", email, password} as User)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide:UsersService,
          useValue:fakeUserService
        },
        {
          provide:AuthService,
          useValue:fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it("returns all users with the given id | username | email", async ()=>{
    const users = await controller.findAllUsers({username:"Emma"} as UpdateUserDto)
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual("h@mail.com")
  })
  it("returns a single with the given user id | username | email", async ()=>{
    const user = await controller.findUser("1")
    expect(user.username).toEqual("TheH")
    expect(user.id).toEqual(1)
    expect(user.email).toEqual("h@mail.com")
  })
  it("Throws an error if a user is not found", async ()=>{
    fakeUserService.findOne = (attrs:Partial<Pick<User, "id" | "username"| "email" >>) => Promise.resolve(null);
    await expect(controller.findUser("1")).rejects.toThrow(NotFoundException)
  })
  it("signin updates session objects and returns user", async () => {
    const session = {userId:-10}
    const user = await controller.signIn({email:"testuser", password:"testpassword"}, session)
    expect(user).toBeDefined()
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
});
