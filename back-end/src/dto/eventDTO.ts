import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

//class to check if event data from GRID's API is valid
export class EventDTO {
  @IsNotEmpty()
  @IsString()
  occurredAt: string;

  @IsNotEmpty()
  @IsNumber()
  sequenceNumber: number;
}
