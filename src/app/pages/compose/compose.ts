import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GeminiService } from '../../services/gemini';
import { Text2ColorService } from '../../services/text2-color';
import { TheColorAPIService } from '../../services/the-color-api';
import { StepOverlay } from '../../components/step-overlay/step-overlay';
import { BtnSpinner } from '../../components/btn-spinner/btn-spinner';
import { ErrorAlert } from '../../components/error-alert/error-alert';
import { of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-compose',
  imports: [RouterLink, StepOverlay, BtnSpinner, ErrorAlert],
  templateUrl: './compose.html',
  styleUrl: './compose.scss',
})
export class Compose {

  // Exponer el enum al template
  StepType = StepType;

  geminiService: GeminiService = inject(GeminiService);
  text2ColorService: Text2ColorService = inject(Text2ColorService);
  theColorAPIService: TheColorAPIService = inject(TheColorAPIService);
  cdr = inject(ChangeDetectorRef);

  steps: Step[] = this.getInitSteps();

  loading: boolean = false;
  loadingPrompt: boolean = false;
  loadingColorBase: boolean = false;
  loadingPaleta: boolean = false;

  errorConcepto?: any = null;
  errorColorBase?: any = null;
  errorEsquema?: any = null;
  errorResultado?: any = null;


  onClickBtnPrompt() {
    this.loadingPrompt = true;

    this.delayedOperation(
      2000,
      (value: string) => {
        this.errorConcepto = null;
      },
      () => this.loadingPrompt = false);
  }

  onClickBtnColorBase() {
    this.loadingColorBase = true;

    this.delayedOperation(
      2000,
      (value: string) => {
        this.setStep(StepType.BASE_COLOR);
        this.errorConcepto = null;
      },
      () => this.loadingColorBase = false);
  }
  
  onClickBtnDefinirEsquema() {
    this.delayedOperation(
      1,
      (value: string) => {
        this.setStep(StepType.SCHEME);
        this.errorColorBase = null;
      },
      () => {});
  }
  
  onClickBtnGenerarPaleta() {
    this.loadingPaleta = true;

    this.delayedOperation(
      2000,
      (value: string) => {
        this.setStep(StepType.RESULT);
        this.errorEsquema = null;
      },
      () => this.loadingPaleta = false);
  }

  private delayedOperation(ms: number, operation: (value: string) => void, end: () => void) {
    this.loading = true

    of("").pipe(
      delay(ms),
      finalize(() => {
        end();
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (value: string) => {
        operation(value);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  restart() {
    this.steps = this.getInitSteps();
    this.loading = false;
  }

  setStep(type: StepType) {
    const order: StepType[] = [
      StepType.CONCEPT,
      StepType.BASE_COLOR,
      StepType.SCHEME,
      StepType.RESULT,
    ];

    const currentIndex = order.indexOf(type);

    for (let i = 0; i < order.length; i++) {
      const step = this.getStep(order[i]);

      if (step) {
        if (i < currentIndex - 1) {
          step.status = StepStatus.COMPLETED;
        } 
        else if (i === currentIndex - 1) {
          step.status = StepStatus.EDITABLE;
        } 
        else if (i === currentIndex) {
          step.status = StepStatus.ENABLED;
          step.initiated = true;
        } 
        else {
          step.status = StepStatus.DISABLED;
        }
      }
    }

    this.steps = [...this.steps];
  }

  getStep(type: StepType): Step | undefined {
    return this.steps.find(s => s.type === type);
  }

  hide(type: StepType): boolean {
    return this.initiated(type);
  }

  initiated(type: StepType): boolean {
    return this.getStep(type)?.initiated !== true;
  }

  private getInitSteps(): Step[] {
    return [
      { type: StepType.CONCEPT, status: StepStatus.ENABLED, initiated: true },
      { type: StepType.BASE_COLOR, status: StepStatus.DISABLED, initiated: false },
      { type: StepType.SCHEME, status: StepStatus.DISABLED, initiated: false },
      { type: StepType.RESULT, status: StepStatus.DISABLED, initiated: false }
    ]
  }
}

export interface Step {
  type: StepType;
  status: StepStatus;
  initiated: boolean;
}

export enum StepType {
  CONCEPT = 'CONCEPT',
  BASE_COLOR = 'BASE-COLOR',
  SCHEME = 'SCHEME',
  RESULT = 'RESULT'
}

export enum StepStatus {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  EDITABLE = 'EDITABLE',
  COMPLETED = 'COMPLETED'
}