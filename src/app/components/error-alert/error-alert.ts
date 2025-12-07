import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  imports: [],
  templateUrl: './error-alert.html',
  styleUrl: './error-alert.scss',
})
export class ErrorAlert {

  // Descripción del error
  @Input() error?: any = null;

  // Clase(s) de la alerta
  @Input() alertClass: string = '';

  getErrorMessage(): string {
    if (!this.error)
      return '';

    if (typeof this.error === 'string')
      return this.error;

    return JSON.stringify(this.error, null, 2);
  }
}