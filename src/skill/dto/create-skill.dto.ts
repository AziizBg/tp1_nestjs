import { IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  Designation: string;
}
