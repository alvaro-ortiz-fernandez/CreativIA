import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Step, StepStatus } from '../../pages/compose/compose';

@Component({
  selector: 'app-step-overlay',
  imports: [],
  templateUrl: './step-overlay.html',
  styleUrl: './step-overlay.scss',
})
export class StepOverlay {
  
  @Input() step: Step<any> | undefined;
  @Input() loading: boolean = false;
  @Output() editStep = new EventEmitter<Step<any>>();

  edit() {
    if (this.isEditable() && this.step && this.loading !== true)
      this.editStep.emit(this.step);
  }

  isActionable(): boolean {
    return this.isEditable() && this.loading !== true;
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
    return this.step?.status === status;
  }
}
