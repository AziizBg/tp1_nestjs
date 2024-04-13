import { IsNotEmpty, ValidateNested, IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';


export class LoginCredentialsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
