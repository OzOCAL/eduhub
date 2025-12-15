import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeleteCourseDto {
    @IsString()
    @ApiProperty()
    id: string;
}