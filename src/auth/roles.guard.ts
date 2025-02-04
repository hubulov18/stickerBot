import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    // @ts-ignore
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    }
}