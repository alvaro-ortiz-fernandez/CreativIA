import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FirebaseService } from '../../services/firebase';
import { finalize, Observable } from 'rxjs';
import { Spinner, SpinnerSize } from '../../components/spinner/spinner';
import { ColorPalette } from '../../model/colors/ColorPalette';
import { ErrorAlert } from '../../components/error-alert/error-alert';

@Component({
  selector: 'app-library',
  imports: [AsyncPipe, ErrorAlert, Spinner],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {

  SpinnerSize = SpinnerSize; // Exponer el enum al template

  private cdr = inject(ChangeDetectorRef);
  private firebaseService: FirebaseService = inject(FirebaseService);
  colorPalettes!: Observable<ColorPalette[]>;
  loadError: any;

  constructor() {
    this.colorPalettes = this.firebaseService.getColorPalettes();
    this.colorPalettes
      .pipe(finalize(() => this.cdr.detectChanges() ))
      .subscribe({ error: (err) => this.loadError = err });
  }
}
