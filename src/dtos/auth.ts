import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class Register {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  tag: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsNumberString()
  @IsString()
  @MaxLength(4)
  pin: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class Login {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
