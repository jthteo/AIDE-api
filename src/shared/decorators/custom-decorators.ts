import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Roles = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const auth = request.headers['authorization'];

    if (!auth) {
      return null;
    }

    const tokenString: string = auth.split(' ')?.at(-1);

    if (!tokenString) {
      return null;
    }

    const base64Payload = tokenString.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    const updatedJwtPayload = JSON.parse(payloadBuffer.toString());

    const roles: string[] = updatedJwtPayload.realm_access.roles;

    return roles;
  },
);