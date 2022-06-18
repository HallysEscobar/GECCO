import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccesoService } from 'src/app/servicios/Acceso.service';
import { AgregarAccesosComponent } from './agregar-accesos/agregar-accesos.component';
import Swal from 'sweetalert2';
import { ModificarAccesosComponent } from './modificar-accesos/modificar-accesos.component';
@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.css']
})
export class AccesosComponent implements OnInit {
  dtOptions: any = {};
  public listarAccesoRol: any = [];
  public Rol: any;
  displayedColumns = ['id', 'idModulo','idRol', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  constructor(
    // private servicioAccesoRol: ,
    public dialog: MatDialog,
    public accesoServicio : AccesoService,
    private route: ActivatedRoute,
    private accessoRol : AccesoService

  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }
  public listarTodos(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      // console.log(id);
      this.accessoRol.listarTodos().subscribe( res =>{
        res.forEach(element => {
          if(element.idRol.id == id){
            this.listarAccesoRol.push(element)
            this.Rol = element.idRol.descripcion;
          }
        });
        console.log(this.listarAccesoRol)
        this.dataSource = new MatTableDataSource(this.listarAccesoRol);
      })
    })
  }

  abrirModal(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      const dialogRef = this.dialog.open(AgregarAccesosComponent, {
        width: '500px',
        data: id
      });
    })
  }
  modificarAcceso(id: number): void {
    const dialogRef = this.dialog.open(ModificarAccesosComponent, {
      width: '500px',
      data: id
    });
    console.log(id)
  }

  eliminarAcceso(id:number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-5'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.accesoServicio.eliminar(id).subscribe(res=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el modulo.',
            'success'
          )
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado!',
          '',
          'error'
        )
      }
    })
  }

}





