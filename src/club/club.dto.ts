import { Type } from 'class-transformer';
import {IsDate, IsNotEmpty, IsString, IsUrl, MaxLength} from 'class-validator';
export class ClubDto {
    
    @IsString()
    @IsNotEmpty()
    readonly name: string;
 
    @Type(() => Date)
    @IsDate()
    readonly foundationDate: Date;
 
    @IsUrl()
    @IsNotEmpty()
    readonly image: string;
 
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly description: string;

}
