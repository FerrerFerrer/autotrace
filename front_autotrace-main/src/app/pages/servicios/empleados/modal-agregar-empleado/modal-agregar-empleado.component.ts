import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Util } from '@/utils/Util';
import { UsuarioServiceService } from '@services/usuario-service.service';
import { EmpleadosService } from '@services/empleados.service';
@Component({
  selector: 'app-modal-agregar-empleado',
  templateUrl: './modal-agregar-empleado.component.html',
  styleUrls: ['./modal-agregar-empleado.component.scss']
})
export class ModalAgregarEmpleadoComponent implements OnInit {

  @Input() tituloModal: any;
  listUsuarios: any[] = [];
  ocupado: boolean = false;
  selectUsuario: any;
  form: FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private _userService: UsuarioServiceService,
    private _empleadosService: EmpleadosService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private el: ElementRef) {
    this.form = this.fb.group({
      InputCveEmpleado: ['', [Validators.required, Validators.maxLength(6)]],
      InputNombreEmpleado: ['', [Validators.required, Validators.minLength(1)]],
      InputAPaterno: ['', [Validators.required]],
      InputAMaterno: ['', [Validators.required]],
      InputDescripcion: ['', [Validators.required, Validators.maxLength(100)]],
      InputSelectUsuario: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.selectUsuario = this.el.nativeElement.querySelector("#InputSelectUsuario");
    this.obtenerUsuarios();
  }

  validacionNoCaracteresEspeciales(event) {
    Util.quitarCaracteresEspeciales(event);
  }

  agregar() {
    const body: any = {
      cveEmpleado: this.form.get('InputCveEmpleado')?.value,
      idusuario: this.form.get('InputSelectUsuario')?.value,
      nombre: this.form.get('InputNombreEmpleado')?.value,
      apellido_paterno: this.form.get('InputAPaterno')?.value,
      apellido_materno: this.form.get('InputAMaterno')?.value,
      activo: 1,
      descripcion: this.form.get('InputDescripcion')?.value
    }

    if (this.form.valid) {
      this.spinner.show();
      this._empleadosService.crearEmpleado(body).subscribe((data) => {
        this.activeModal.close();
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El empleado se guardo correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }, (error) => {
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
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verificar Datos Ingresados!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  verificarUsuarioLibre(val) {
    let idusuario = val;
    this._userService.verificarUsuarioLibre(idusuario).subscribe(data => {
      let contador = 0;
      for (let value of data[0]) {
        contador = value.contador;
      }
      if (contador === 1) {
        this.ocupado = true;
        this.selectUsuario.classList.remove('is-valid');
        this.selectUsuario.classList.add('is-invalid');
      }
      else {
        this.ocupado = false;
        this.selectUsuario.classList.remove('is-invalid');
        this.selectUsuario.classList.add('is-valid');
      }
    })
  }

  obtenerUsuarios() {
    this._userService.getListUsuarios().subscribe(data => { this.listUsuarios = data[0] });
  }

}
