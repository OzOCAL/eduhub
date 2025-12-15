import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateDocumentDto {
    @IsString()
    @ApiProperty()
    title: string

    @IsString()
    @ApiProperty()
    fileName: string

    @IsString()
    @ApiProperty()
    fileType: string

    @IsString()
    @ApiProperty()
    path: string

    // courseId is taken from route param, not required in body
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    courseId?: string
}
