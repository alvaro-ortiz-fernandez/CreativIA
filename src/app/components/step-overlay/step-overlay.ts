import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Step } from './Step';

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
    if (this.isActionable())
      this.editStep.emit(this.step);
  }

  isActionable(): boolean {
    return this.step?.isEditable() === true && this.loading !== true;
  }
}
