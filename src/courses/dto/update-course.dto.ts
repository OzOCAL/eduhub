import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    name?: string

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    code?: string

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description?: string

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    teacherId?: string

    @IsOptional()
    @IsArray()
    @ApiProperty({ required: false, type: [String] })
    students?: string[]
}
