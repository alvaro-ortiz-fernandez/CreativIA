export class Step<T> {
  data: T;
  status: StepStatus;
  initiated: boolean;
  error?: any;

  constructor(data: T, status: StepStatus = StepStatus.DISABLED,
      initiated: boolean = false, error: any = undefined) {

    this.data = data;
    this.status = status;
    this.initiated = initiated;
    this.error = error;
  }
  
  isEnabled(): boolean {
    return this.is(StepStatus.ENABLED);
  }

  isEditable(): boolean {
    return this.is(StepStatus.EDITABLE);
  }

  isCompleted(): boolean {
    return this.is(StepStatus.COMPLETED);
  }

  private is(status: StepStatus): boolean {
    return this.status === status;
  }
}

export enum StepStatus {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  EDITABLE = 'EDITABLE',
  COMPLETED = 'COMPLETED'
}