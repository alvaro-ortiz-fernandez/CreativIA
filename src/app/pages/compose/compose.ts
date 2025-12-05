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
import { Concept } from '../../model/colors/Concept';
import { Color } from '../../model/colors/Color';
import { ColorScheme } from '../../model/colors/ColorScheme';
import { ColorPalette } from '../../model/colors/ColorPalette';

@Component({
  selector: 'app-compose',
  imports: [RouterLink, StepOverlay, BtnSpinner, ErrorAlert],
  templateUrl: './compose.html',
  styleUrl: './compose.scss',
})
export class Compose {

  geminiService: GeminiService = inject(GeminiService);
  text2ColorService: Text2ColorService = inject(Text2ColorService);
  theColorAPIService: TheColorAPIService = inject(TheColorAPIService);
  cdr = inject(ChangeDetectorRef);

  conceptStep: Step<Concept> = this.initConceptStep();
  baseColorStep: Step<Color> = this.initBaseColorStep();
  schemeStep: Step<ColorScheme> = this.initSchemeStep();
  resultStep: Step<ColorPalette> = this.initResultStep();

  loading: boolean = false;
  loadingPrompt: boolean = false;
  loadingColorBase: boolean = false;
  loadingPaleta: boolean = false;


  onClickBtnPrompt() {
    this.loadingPrompt = true;
    this.conceptStep.error = null;

    this.delayedOperation(
      2000,
      (value: string) => {
      },
      (err) => this.conceptStep.error = err,
      () => this.loadingPrompt = false);
  }

  onClickBtnColorBase() {
    this.loadingColorBase = true;
    this.conceptStep.error = null;

    this.delayedOperation(
      2000,
      (value: string) => {
        this.setStep(this.baseColorStep);
      },
      (err) => this.conceptStep.error = err,
      () => this.loadingColorBase = false);
  }
  
  onClickBtnDefinirEsquema() {
    this.baseColorStep.error = null;

    this.delayedOperation(
      1,
      (value: string) => {
        this.setStep(this.schemeStep);
      },
      (err) => this.baseColorStep.error = err,
      () => {});
  }
  
  onClickBtnGenerarPaleta() {
    this.loadingPaleta = true;
    this.schemeStep.error = null;

    this.delayedOperation(
      2000,
      (value: string) => {
        this.setStep(this.resultStep);
      },
      (err) => this.schemeStep.error = err,
      () => this.loadingPaleta = false);
  }

  private delayedOperation(ms: number,
      operation: (value: string) => void,
      error: (err: any) => void,
      end: () => void) {

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
        error(err);
      }
    });
  }

  restart() {
    this.conceptStep = this.initConceptStep();
    this.baseColorStep = this.initBaseColorStep();
    this.schemeStep = this.initSchemeStep();
    this.resultStep = this.initResultStep();

    this.loading = false;
  }

  setStep(step: Step<any>) {
    const order: Step<any>[] = [
      this.conceptStep,
      this.baseColorStep,
      this.schemeStep,
      this.resultStep,
    ];

    const currentIndex = order.indexOf(step);

    for (let i = 0; i < order.length; i++) {
      const step = order[i];

      if (step) {
        if (i < currentIndex - 1) {
          step.status = StepStatus.COMPLETED;

        } else if (i === currentIndex - 1) {
          step.status = StepStatus.EDITABLE;

        } else if (i === currentIndex) {
          step.status = StepStatus.ENABLED;
          step.initiated = true;

        } else {
          step.status = StepStatus.DISABLED;
        }
      }
    }
  }

  hide(step: Step<any>): boolean {
    return this.initiated(step);
  }

  initiated(step: Step<any>): boolean {
    return step?.initiated !== true;
  }

  private initConceptStep(): Step<Concept> {
    return new Step(new Concept(), StepStatus.ENABLED, true);
  }

  private initBaseColorStep(): Step<Color> {
    return new Step(new Color(), StepStatus.DISABLED, false);
  }

  private initSchemeStep(): Step<ColorScheme> {
    return new Step(new ColorScheme(), StepStatus.DISABLED, false);
  }

  private initResultStep(): Step<ColorPalette> {
    return new Step(new ColorPalette(), StepStatus.DISABLED, false);
  }
}

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
}

export enum StepStatus {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  EDITABLE = 'EDITABLE',
  COMPLETED = 'COMPLETED'
}