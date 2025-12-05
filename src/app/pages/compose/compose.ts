import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GeminiService } from '../../services/gemini';
import { Text2ColorService } from '../../services/text2-color';
import { TheColorAPIService } from '../../services/the-color-api';
import { StepOverlay } from '../../components/step-overlay/step-overlay';
import { BtnSpinner } from '../../components/btn-spinner/btn-spinner';
import { ErrorAlert } from '../../components/error-alert/error-alert';
import { delay, finalize, shareReplay } from 'rxjs/operators';
import { Concept } from '../../model/colors/Concept';
import { Color } from '../../model/colors/Color';
import { ColorScheme } from '../../model/colors/ColorScheme';
import { ColorPalette } from '../../model/colors/ColorPalette';
import { of, OperatorFunction } from 'rxjs';

@Component({
  selector: 'app-compose',
  imports: [
    RouterLink, FormsModule, ReactiveFormsModule,
    StepOverlay, BtnSpinner, ErrorAlert
  ],
  templateUrl: './compose.html',
  styleUrl: './compose.scss',
})
export class Compose {

  // Servicios
  geminiService: GeminiService = inject(GeminiService);
  text2ColorService: Text2ColorService = inject(Text2ColorService);
  theColorAPIService: TheColorAPIService = inject(TheColorAPIService);
  cdr = inject(ChangeDetectorRef);

  // Pasos del formulario
  conceptStep: Step<Concept> = this.initConceptStep();
  baseColorStep: Step<Color> = this.initBaseColorStep();
  schemeStep: Step<ColorScheme> = this.initSchemeStep();
  resultStep: Step<ColorPalette> = this.initResultStep();

  // Controles de carga
  loading: boolean = false;
  loadingPrompt: boolean = false;
  loadingColorBase: boolean = false;
  loadingEsquema: boolean = false;
  loadingPaleta: boolean = false;

  constructor() { console.log(this.baseColorStep.data) }


  onClickBtnPrompt() {
    this.setLoading(true);
    this.loadingPrompt = true;
    this.conceptStep.error = null;

    this.geminiService.getSuggestionPrompt(this.conceptStep.data.context)
      .pipe(this.onFinalize(l => (this.loadingPrompt = l)))
      .subscribe({
        next: (value: string) => {
          this.conceptStep.data.suggestion = value;
        },
        error: (err) => this.conceptStep.error = err
      });
  }

  onClickBtnColorBase() {
    this.setLoading(true);
    this.loadingColorBase = true;
    this.conceptStep.error = null;

    this.text2ColorService.text2Color(this.conceptStep.data)
      .pipe(this.onFinalize(l => (this.loadingColorBase = l)))
      .subscribe({
        next: (value: Color) => {
          this.baseColorStep.data = value;
          this.setStep(this.baseColorStep);
        },
        error: (err) => this.conceptStep.error = err
      });
  }
  
  onClickBtnDefinirEsquema() {
    this.setLoading(true);
    this.loadingEsquema = true;
    this.baseColorStep.error = null;

    of("")
      .pipe(delay(1000))
      .pipe(shareReplay(1))
      .pipe(this.onFinalize(l => (this.loadingEsquema = l)))
      .subscribe({
        next: (value: string) => {
          this.setStep(this.schemeStep);
        },
        error: (err) => this.baseColorStep.error = err
      });
  }
  
  onClickBtnGenerarPaleta() {
    this.setLoading(true);
    this.loadingPaleta = true;
    this.schemeStep.error = null;

    this.theColorAPIService.getColorPalette(this.baseColorStep.data, this.schemeStep.data)
      .pipe(this.onFinalize(l => (this.loadingPaleta = l)))
      .subscribe({
        next: (value: ColorPalette) => {
          this.resultStep.data = value;
          this.setStep(this.resultStep);
        },
        error: (err) => this.schemeStep.error = err
      });
  }

  private onFinalize(loaderSetter: (v: boolean) => void): OperatorFunction<any, any> {
    return finalize(() => {
      loaderSetter(false);
      this.setLoading(false);
      this.cdr.detectChanges();
    });
  }

  syncColorFromHEX() {
    const hex = this.baseColorStep.data?.hex?.replace('#', '');

    if (hex) {
      this.baseColorStep.data.r = parseInt(hex.substring(0, 2), 16);
      this.baseColorStep.data.g = parseInt(hex.substring(2, 4), 16);
      this.baseColorStep.data.b = parseInt(hex.substring(4, 6), 16);
    }
  }

  syncColorFromRGB() {
    const { r, g, b } = this.baseColorStep.data;

    if ([r, g, b].some(v => v < 0 || v > 255 || v == null))
      return;

    this.baseColorStep.data.hex = (
        '#' +
        [r, g, b]
          .map(v => v.toString(16).padStart(2, '0'))
          .join('')
      ).toUpperCase();
  }

  restart() {
    this.conceptStep = this.initConceptStep();
    this.baseColorStep = this.initBaseColorStep();
    this.schemeStep = this.initSchemeStep();
    this.resultStep = this.initResultStep();

    this.setLoading(false);
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

  private setLoading(value: boolean) {
    this.loading = value;
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