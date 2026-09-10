import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { DemoRole } from '@comparison/contracts';
import type { Principal } from './principal.js';

@Injectable()
export class DemoIdentityGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined>; principal?: Principal }>();
    const requestedRole = request.headers['x-demo-role'];
    const role: DemoRole = requestedRole === 'viewer' ? 'viewer' : 'reviewer';
    request.principal = { email: `${role}@example.test`, role };
    return true;
  }
}
