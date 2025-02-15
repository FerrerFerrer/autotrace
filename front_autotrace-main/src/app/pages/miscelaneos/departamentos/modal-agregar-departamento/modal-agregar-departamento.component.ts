import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner"; //Importancion del spinner
import { DepartamentosService } from '@services/departamentos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '@/utils/Util';

@Component({
  selector: 'app-modal-agregar-departamento',
  templateUrl: './modal-agregar-departamento.component.html',
  styleUrls: ['./modal-agregar-departamento.component.scss']
})
export class ModalAgregarDepartamentoComponent implements OnInit {

  @Input() tituloModal: any;
  form: FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private servicioDepartamento:DepartamentosService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService) {
      this.form = this.fb.group({
        pa_cveDepartamento: [
            '',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30)
            ]
        ],
        pa_departamento: [
            '',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100)
            ]
        ],
    });

     }

  ngOnInit(): void {

  }

  validacionNoCaracteresEspeciales(event) {
    Util.quitarCaracteresEspeciales(event);
}

  agregar() {
    const body: any = {
      pa_cveDepartamento:this.form.get('pa_cveDepartamento')?.value,
       pa_departamento:this.form.get('pa_departamento')?.value
  };

  if (this.form.valid) {
      this.spinner.show();
      this.servicioDepartamento.insertarDepartamento(body).subscribe(
          (data) => {
              this.activeModal.close();
              this.spinner.hide();
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Datos guardados correctamente',
                  showConfirmButton: false,
                  timer: 1500
              });
          },
          (error) => {
              this.spinner.hide();
              Swal.fire({
                  title: 'Ha ocurrido un error',
                  showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                  }
                })
          }
      );
  } else {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Verificar Datos Ingresados!',
          showConfirmButton: false,
          timer: 1500
      });
  }
  }

}
