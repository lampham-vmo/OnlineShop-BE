import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class GetUserAccountDTO extends PickType(User,["id","fullname","email","status","createdAt"] as const){
    readonly roleName: string
}