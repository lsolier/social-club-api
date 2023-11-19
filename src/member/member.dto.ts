import { Type } from 'class-transformer';
import {IsDate, IsEmail, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class MemberDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
 
    @Type(() => Date)
    @IsDate()
    readonly birthday: Date;

}
