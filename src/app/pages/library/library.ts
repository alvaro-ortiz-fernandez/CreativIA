import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FirebaseService } from '../../services/firebase';
import { Observable } from 'rxjs';
import { Spinner, SpinnerSize } from '../../components/spinner/spinner';
import { ColorPalette } from '../../model/colors/ColorPalette';

@Component({
  selector: 'app-library',
  imports: [AsyncPipe, Spinner],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {

  SpinnerSize = SpinnerSize; // Exponer el enum al template

  private firebaseService: FirebaseService = inject(FirebaseService);
  colorPalettes!: Observable<ColorPalette[]>;

  constructor() {
    this.colorPalettes = this.firebaseService.getColorPalettes();
  }
}
