import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  FormControl } from '@angular/forms';
import { SeccionService } from 'src/app/services/seccion.service';
import { ClaseService } from 'src/app/services/clase.service';
import { MaestroService } from 'src/app/services/maestro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css']
})
export class SeccionComponent implements OnInit {
formSeccion: FormGroup;
accion='Agregar';
id: string | undefined;
listaClases: any[] = [];
listaMaestros: any[] = [];

  constructor(private fb:FormBuilder, private _seccionService: SeccionService,   private _claseService: ClaseService,
    private _maestroService: MaestroService) { 
    this.formSeccion = this.fb.group({
      id:['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      idClase: ['',[Validators.required, Validators.maxLength(50), Validators.minLength(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      idMaestro:['',[Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      hora:['', [Validators.required,  this.validateTime.bind(this)]],
      aula:['',[Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cupos:['', [Validators.required, Validators.maxLength(3), Validators.minLength(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

  }
 
  ngOnInit(): void {
    this.ObtenerSeccion();
    this.ObtenerClases();
    this.ObtenerMaestros();
  }

  listaSeccion: any[] =[
  ];

  AddSeccion() {
    console.log("form -->", this.formSeccion.value);
    const seccion: any = {
      id: this.formSeccion.get('id')?.value,
      idClase: parseInt(this.formSeccion.get('idClase')?.value, 10),
      idMaestro: this.formSeccion.get('idMaestro')?.value,
     hora: this.formatTime(this.formSeccion.get('hora')?.value),
      //hora: this.formSeccion.get('hora')?.value,
      aula: this.formSeccion.get('aula')?.value,
      cupos: parseInt(this.formSeccion.get('cupos')?.value, 10)
    };
    console.log("seccion -->", seccion);
    if (this.id == undefined) {
      // add Seccion
      this._seccionService.saveSeccion(seccion).subscribe({
        next: data => {
        console.log('Sección agregada con éxito', data);
        this.formSeccion.reset(); // limpiar formulario
        this.ObtenerSeccion(); // refrescar la lista
        this.id = undefined;
        this.accion = 'Agregar';
        Swal.fire({
          title: "Agregar",
          text: "Se agrego correctamente la seccón",
          icon: "success"
        });
      }, 
      error: error => {
        if (error.status === 400) { // Conflicto
          Swal.fire({
            title: "¡Advertencia!",
            text: "La sección que intenta añadir ya existe.",
            icon: "warning"
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Error al agregar la seccón",
            icon: "error"
          });
        }
      }
      });
    }else {
      // Editar cliente
      this._seccionService.editarSeccion(this.id, seccion).subscribe({
        next: data => {
        console.log('Seccion actualizada con éxito', data);
        this.formSeccion.reset();
        this.ObtenerSeccion();
        this.id = undefined;
        this.accion = 'Agregar';
        this.setActionState();
        Swal.fire({
          title: "Actualización",
          text: "Sección actualizada con éxito",
          icon: "success"
        });
      },
      error: error => {
        Swal.fire({
          title: "Error",
          text: "Error al actualizar la seccón",
          icon: "error"
        });
      } 
      });
    }
  }
  ObtenerSeccion(){
    this._seccionService.getListarSeccion().subscribe(data =>{
      console.log("data ->",data);
      this.listaSeccion = data;
    }, error=>{
      console.log("Error",error);
    })
  }
  ObtenerClases() {
    this._claseService.getListarClase().subscribe({
      next: data => {
        this.listaClases = data;
      },
      error: error => {
        console.error("Error", error);
      }
    });
  }
  ObtenerMaestros() {
    this._maestroService.getListarMaestros().subscribe({
      next: data => {
        this.listaMaestros = data;
      },
      error: error => {
        console.error("Error", error);
      }
    });
  }
formatTime(time: string): string {
  // Valida y convierte el formato de tiempo
  const timeParts = time.split(':');
  if (timeParts.length === 2) {
    const [hours, minutes] = timeParts;
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  } else if (timeParts.length === 3) {
    const [hours, minutes, seconds] = timeParts;
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return '00:00:00';
}

validateTime(control: FormControl) {
  const time = control.value;
  if (!time) {
    return { invalidTime: true };
  }
  const timeParts = time.split(':');
  if (timeParts.length !== 2) {
    return { invalidTime: true };
  }
  const [hours, minutes] = timeParts;
  if (
    isNaN(hours) || hours < 0 || hours > 23 ||
    isNaN(minutes) || minutes < 0 || minutes > 59
  ) {
    return { invalidTime: true };
  }
  return null;
}
/*
  eliminarSeccion(id: string) {
    Swal.fire({
      title: "¿Está seguro de eliminar esta sección?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._seccionService.deleteSeccion(id).subscribe({
          next: response => {
            this.listaSeccion = this.listaSeccion.filter(seccion => seccion.id !== id);
            this.setActionState();
            Swal.fire({
              title: "Eliminada!",
              text: "La sección ha sido eliminada.",
              icon: "success"
            });
          },
          error: error => {
            Swal.fire({
              title: "Error",
              text: "Error al eliminar la seccón, por favor comunicarce con el area encargada",
              icon: "error"
            });
          }
        });
      }
    });
  }
  */

  eliminarSeccion(id: string) {
    Swal.fire({
      title: "¿Está seguro de eliminar esta sección?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._seccionService.deleteSeccion(id).subscribe({
          next: response => {
            this.listaSeccion = this.listaSeccion.filter(seccion => seccion.id !== id);
            this.setActionState();
            Swal.fire({
              title: "Eliminada!",
              text: "La sección ha sido eliminada.",
              icon: "success"
            });
          },
          error: error => {
            if (error.status === 400) { // Conflicto
              Swal.fire({
                title: "Error",
                text: "Error al eliminar la seccón, por favor comunicarce con el area encargada",
                icon: "error"
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Error al eliminar la seccón",
                icon: "error"
              });
            }
          }
        });
      }
    });
}


  editarSeccion(seccion : any) //traer la informacion al frm para editar
  {
    this.accion = 'Editar';
    this.id = seccion.id;

    this.formSeccion.patchValue({
      id : seccion.id, 
      idClase: seccion.idClase,
      idMaestro: seccion.idMaestro,
      hora : seccion.hora,
      aula: seccion.aula,
      cupos: seccion.cupos,
   
    });
    this. setActionState();
  }

  setActionState() {
    if (this.accion === 'Editar') {
      this.formSeccion.get('id')?.disable();
    } else {
      this.formSeccion.get('id')?.enable();
    }
  }

}
