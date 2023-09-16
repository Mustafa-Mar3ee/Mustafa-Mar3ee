import { IsString, IsBoolean } from 'class-validator';

class TodoDTO {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsBoolean()
  public isComplete: boolean;

  constructor( title: string, description: string, isComplete: boolean) {
    this.title = title;
    this.description = description;
    this.isComplete = isComplete;
  }
}
export default TodoDTO;
