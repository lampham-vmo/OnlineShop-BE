import { Expose } from "class-transformer";

export class ApiResponse<T>{

    @Expose()
    code: number|1000;

    message: string;

    @Expose()
    result?: T

    constructor(result?:T,messsage = "Success",code = 1000){
        this.code = code;
        this.message = messsage;
        this.result = result
    }
}