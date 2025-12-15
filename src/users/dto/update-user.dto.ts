import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @ApiProperty()
    id: string

    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    firstName: string

    @IsString()
    @ApiProperty()
    lastName: string

    @IsString()
    @MinLength(6)
    @ApiProperty()
    password: string

    /* @IsString()
    @MinLength(6)
    @ApiProperty()
    confirmPassword: string */
}