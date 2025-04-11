import { IsNotEmpty, IsNumber  } from "class-validator";
export class UpdateUserRoleDTO {
    constructor(userId: number, newRoleId: number){
        this.userId = userId;
        this.newRoleId = newRoleId;
    }
    @IsNotEmpty()
    @IsNumber()
    readonly userId: number;

    @IsNotEmpty()
    @IsNumber()
    readonly newRoleId: number;
}