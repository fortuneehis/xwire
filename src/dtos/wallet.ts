import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";

export class Transfer {
  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsNumberString()
  @IsString()
  @MaxLength(4)
  pin: string;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  reason: string;
}

export class Deposit {
  @IsInt()
  @IsPositive()
  amount: number;
}
