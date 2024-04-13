import { IsNotEmpty, ValidateNested, IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { CV } from 'src/cv/entities/cv.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => CV)
  // cvs: CV[];
}
