export class Concept {
  context: string;
  suggestion: string;

  constructor(context: string = '', suggestion: string = '') {
    this.context = context;
    this.suggestion = suggestion;
  }
}