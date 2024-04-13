import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Skill } from '../../skill/entities/skill.entity';
import { User } from '../../user/entities/user.entity';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  cin: number;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  path: string;

  @IsNotEmpty()
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => Skill)
  skills: Skill[];

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
