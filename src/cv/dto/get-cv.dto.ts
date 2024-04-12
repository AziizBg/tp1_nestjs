import { IsOptional, IsString } from 'class-validator';

export class GetCvDto {
  @IsOptional()
  @IsString()
  critere: string;

  @IsOptional()
  @IsString()
  age: string;
}