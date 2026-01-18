import { QuizQuestion } from './quiz.entity';

describe('QuizQuestion', () => {
  it('should create a quiz question with valid data', () => {
    const question = new QuizQuestion();
    question.question = 'What is 2 + 2?';
    question.options = ['3', '4', '5', '6'];
    question.correctAnswerIndex = 1;
    question.explanation = 'The sum of 2 and 2 is 4';

    expect(question.question).toBe('What is 2 + 2?');
    expect(question.options.length).toBe(4);
    expect(question.correctAnswerIndex).toBe(1);
    expect(question.explanation).toBe('The sum of 2 and 2 is 4');
  });

  it('should have correct properties', () => {
    const question = new QuizQuestion();
    
    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctAnswerIndex');
    expect(question).toHaveProperty('explanation');
  });

  it('should allow different types of questions', () => {
    const multipleChoice = new QuizQuestion();
    multipleChoice.question = 'What is the capital of France?';
    multipleChoice.options = ['London', 'Paris', 'Berlin', 'Madrid'];
    multipleChoice.correctAnswerIndex = 1;
    multipleChoice.explanation = 'Paris is the capital of France';

    expect(multipleChoice.options[multipleChoice.correctAnswerIndex]).toBe('Paris');
  });
});
