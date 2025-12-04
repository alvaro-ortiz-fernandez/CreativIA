import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-spinner',
  imports: [],
  templateUrl: './btn-spinner.html',
  styleUrl: './btn-spinner.scss',
})
export class BtnSpinner {

  // Texto del botón
  @Input() label!: string;

  // Clase(s) del botón (bootstrap o custom)
  @Input() btnClass: string = 'btn btn-primary';

  // Icono de Bootstrap Icons
  @Input() iconClass!: string;

  // Posición del icono
  @Input() iconPosition: 'start' | 'end' = 'start';

  // Mostrar spinner en lugar del icono
  @Input() loading: boolean = false;

  // Deshabilitar el botón
  @Input() disabled: boolean = false;

  
  get isDisabled(): boolean {
    return this.loading || this.disabled;
  }
}