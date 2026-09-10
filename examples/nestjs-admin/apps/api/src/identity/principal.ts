import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { DemoRole } from '@comparison/contracts';

export interface Principal {
  email: string;
  role: DemoRole;
}

interface RequestWithPrincipal {
  principal: Principal;
}

export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Principal => context.switchToHttp().getRequest<RequestWithPrincipal>().principal
);
