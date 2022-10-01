import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthService } from './auth.service';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  // TypeOrmModule.forFeature: This is used to create a Users dependency
  // imports: This is used for importing modules
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // providers: This is used to hold classes(services) thatcan be used as dependencies for other classes
  providers: [UsersService, AuthService, 
  //   {
  //   provide:APP_INTERCEPTOR,
  //   useClass:CurrentUserInterceptor
  // }
],
  // exports: This is used to make services available to other modules
  exports: [UsersService]
})
export class UsersModule {
  configure(consume:MiddlewareConsumer){
    consume.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
