import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CV } from '../../cv/entities/cv.entity';

export class GetUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CV)
  cvs: CV[];
}
