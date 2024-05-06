import { IsNotEmpty, IsString, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

@Exclude()
export class eventDTO {
  @IsNotEmpty()
  @IsString()
  occurredAt: string;

  @IsNotEmpty()
  @IsNumber()
  sequenceNumber: number;
}
