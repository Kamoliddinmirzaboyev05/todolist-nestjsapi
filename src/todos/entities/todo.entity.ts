import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Buy milk' })
  title: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2026-03-22T19:00:00.000Z' })
  createdAt: Date;
}
