import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
	@IsString()
	@ApiProperty()
	name: string

	@IsString()
	@ApiProperty()
	code: string

	@IsOptional()
	@IsString()
	@ApiProperty({ required: false })
	description?: string

	@IsString()
	@ApiProperty()
	teacherId: string

	@IsOptional()
	@IsArray()
	@ApiProperty({ required: false, type: [String] })
	students?: string[]
}