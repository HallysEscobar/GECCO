import { AgregarTipoNovedadesComponent } from './agregar-tipo-novedades/agregar-tipo-novedades.component';
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TipoNovedadesService } from 'src/app/servicios/tipoNovedades.Service';
import { ModificarTipoNovedadesComponent } from './modificar-tipo-novedades/modificar-tipo-novedades.component';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-tipo-novedades',
  templateUrl: './tipo-novedades.component.html',
  styleUrls: ['./tipo-novedades.component.css']
})
export class TipoNovedadesComponent implements OnInit {
  dtOptions: any = {};
  public listarTipoNovedades: any = [];

  displayedColumns = ['id', 'descripcion', 'observacion', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioTipoNovedades: TipoNovedadesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioTipoNovedades.listarTodos().subscribe( res =>{
      this.listarTipoNovedades = res;
      this.dataSource = new MatTableDataSource( this.listarTipoNovedades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  agregarTipoNovedades(): void {
    const dialogRef = this.dialog.open(AgregarTipoNovedadesComponent, {
      width: '500px',
    });
  }

  modificarTipoNovedades(id: number): void {
    const dialogRef = this.dialog.open(ModificarTipoNovedadesComponent, {
      width: '500px',
      data: id
    });
  }

  eliminarTipoNovedades(id:number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-5'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '??Estas seguro?',
      text: "No podr??s revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioTipoNovedades.eliminar(id).subscribe(res=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el Tipo de novedad.',
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

   // Filtrado
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  name = 'listaTipoNovedades.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('tipoNovedades');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }
}
