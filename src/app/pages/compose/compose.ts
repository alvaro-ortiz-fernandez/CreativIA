import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GeminiService, GeminiServiceHttp, GeminiServiceMock } from '../../services/gemini';
import { Text2ColorService, Text2ColorServiceHttp, Text2ColorServiceMock } from '../../services/text2-color';
import { TheColorAPIService, TheColorAPIServiceHttp,
  TheColorAPIServiceMock } from '../../services/the-color-api';
import { StepOverlay } from '../../components/step-overlay/step-overlay';
import { BtnSpinner } from '../../components/btn-spinner/btn-spinner';
import { ErrorAlert } from '../../components/error-alert/error-alert';
import { delay, finalize, map, shareReplay, switchMap } from 'rxjs/operators';
import { Concept } from '../../model/colors/Concept';
import { Color } from '../../model/colors/Color';
import { ColorScheme } from '../../model/colors/ColorScheme';
import { ColorPalette } from '../../model/colors/ColorPalette';
import { of, OperatorFunction } from 'rxjs';
import { Step, StepStatus } from '../../components/step-overlay/Step';
import { FirebaseService } from '../../services/firebase';

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
  private geminiServiceHttp: GeminiServiceHttp = inject(GeminiServiceHttp);
  private geminiServiceMock: GeminiServiceMock = inject(GeminiServiceMock);
  private text2ColorServiceHttp: Text2ColorServiceHttp = inject(Text2ColorServiceHttp);
  private text2ColorServiceMock: Text2ColorServiceMock = inject(Text2ColorServiceMock);
  private theColorAPIServiceHttp: TheColorAPIServiceHttp = inject(TheColorAPIServiceHttp);
  private theColorAPIServiceMock: TheColorAPIServiceMock = inject(TheColorAPIServiceMock);
  private firebaseService: FirebaseService = inject(FirebaseService);
  private cdr = inject(ChangeDetectorRef);
  
  disableMock = true;

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

  onClickBtnPrompt() {
    this.loading = true;
    this.loadingPrompt = true;
    this.conceptStep.error = null;

    this.getGeminiService().getSuggestionPrompt(this.conceptStep.data.context)
      .pipe(this.onFinalize(l => (this.loadingPrompt = l)))
      .subscribe({
        next: (value: string) => {
          this.conceptStep.data.suggestion = value;
        },
        error: (err) => this.conceptStep.error = err
      });
  }

  onClickBtnColorBase() {
    this.loading = true;
    this.loadingColorBase = true;
    this.conceptStep.error = null;

    this.getText2ColorService().text2Color(this.conceptStep.data)
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
    this.loading = true;
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
    this.loading = true;
    this.loadingPaleta = true;
    this.schemeStep.error = null;

    this.getTheColorAPIService()
      .getColorPalette(this.baseColorStep.data, this.schemeStep.data, this.conceptStep.data)
      .pipe(
        switchMap((palette: ColorPalette) => {
          this.resultStep.data = palette;

          return this.getGeminiService().getInterpretation(palette)
          .pipe(
            map((interpretation: string) => {
              this.resultStep.data.interpretation = interpretation;
              return this.resultStep.data; // seguimos pasando ColorPalette
            })
          );
        }),
        switchMap((colorPalette: ColorPalette) => {
          return this.firebaseService.saveColorPalette(colorPalette);
        }),
        this.onFinalize(l => (this.loadingPaleta = l))
      )
      .subscribe({
        next: (savedPalette: ColorPalette) => {
          this.resultStep.data = savedPalette;
          this.setStep(this.resultStep);
        },
        error: (err) => this.schemeStep.error = err
      });
  }

  private onFinalize(loaderSetter: (v: boolean) => void): OperatorFunction<any, any> {
    return finalize(() => {
      loaderSetter(false);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  syncColorFromHEX() {
    this.baseColorStep.data?.syncColorFromHEX();
  }

  syncColorFromRGB() {
    this.baseColorStep.data?.syncColorFromRGB();
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

  private getGeminiService(): GeminiService {
    return this.disableMock
        ? this.geminiServiceHttp
        : this.geminiServiceMock;
  }

  private getText2ColorService(): Text2ColorService {
    return this.disableMock
        ? this.text2ColorServiceHttp
        : this.text2ColorServiceMock;
  }

  private getTheColorAPIService(): TheColorAPIService {
    return this.disableMock
        ? this.theColorAPIServiceHttp
        : this.theColorAPIServiceMock;
  }
}