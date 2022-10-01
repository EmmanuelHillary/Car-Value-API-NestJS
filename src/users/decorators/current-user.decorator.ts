import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data:never, context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest()
    const { currentUser } = request
    if (currentUser=== undefined){
        return "AnonymousUser"
    }
    return currentUser
})