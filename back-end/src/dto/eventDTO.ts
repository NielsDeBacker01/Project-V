import { IsNotEmpty, IsString, IsNumber, IsBoolean, ValidateNested } from 'class-validator';

export class EventDTO {
  @IsNotEmpty()
  @IsString()
  occurredAt: string;

  @IsNotEmpty()
  @IsNumber()
  sequenceNumber: number;
}
