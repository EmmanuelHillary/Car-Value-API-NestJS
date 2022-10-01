import { Test,TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './users.entity'
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { throws } from "assert";

describe("AuthService", ()=> {
    let service:AuthService;
    let fakerService: Partial<UsersService>
    

    // This is used to create the auth serice instance as well as the DI container
    // everytime each test is being ran rather than run it over and over again
    beforeEach(async () => {
        // Creating the fake UserService Dependency
        const Users: User[] = []
        fakerService = {
            find: (attrs:Partial<Pick<User, "id" | "username"| "email" >>) => {
                const user = Users.filter(obj => obj.id === attrs.id || obj.email === attrs.email || obj.username === attrs.username)
                return Promise.resolve(user);
            },
            findOne: (attrs:Partial<Pick<User, "id" | "username"| "email" >>) => {
                const [user] = Users.filter(obj => obj.id === attrs.id || obj.email === attrs.email || obj.username === attrs.username)
                return Promise.resolve(user);
            },
            create: (username:string, email:string, password:string) => {
                const user = {id:1, username, email, password}  as User
                Users.push(user)
                return Promise.resolve(user)
            }
        }
    
        // Creating The Testing DI
        const module = await Test.createTestingModule({
            // Passing the injectable module/dependency that we are trying to test for
            providers: [AuthService, 
            // This is use to trick the DI container,
            // its basically saying;
            {
                // When someone or the DI container is asked to provide The UserService as a dependency
                provide:UsersService,
                // Use  the Value fakerService
                useValue:fakerService
            }]
        }).compile()
    
        // Creating The Authservice instance
        service = module.get(AuthService)
        
    })
    
    
    it("It can create an instance of Auth Service", async () =>{
        // Making sure the auth service instance is defined
        expect(service).toBeDefined()
    })
    
    it('Creates a user and checks if the password is hashed', async ()=>{
        const user = await service.signup("Kodak", "Kodak@mail.com", "Password")
        expect(user.password).not.toEqual("Password")
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it("Throws an error if user signs up with an email or username thats already in use", async ()=>{
        await service.signup("Kodak", "kodak@mail.com", "dfnvfjdnfdnv")
        await expect(service.signup("Kodak", "k@mail.com", "1")).rejects.toThrow(BadRequestException)
    })

    it("Throws an error if user sign in credentials are invalid", async ()=>{
        await service.signup("Kodak", "kodak@mail.com", "dfnvfjdnfdnv")
        await expect(service.signin("kodack", "kodak123")).rejects.toThrow(NotFoundException) 
    })

    it(("Throws an error if user password is incorrect"),async () => {
      await service.signup("Kodak", "kodak@mail.com", "dfnvfjdnfdnv")
      await expect(service.signin("Kodak", "not password")).rejects.toThrow(BadRequestException)  
    })
    
    it(("returns a user if correct password is provided"),async () => {
        await service.signup("Kodak", "kodak@mail.com", "dfnvfjdnfdnv")
        const user = await service.signin("Kodak", "dfnvfjdnfdnv")
        expect(user).toBeDefined()
    })
})

