import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TurnosService } from 'src/app/servicios/turnos.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  dtOptions: any = {};
  public listarTurnos: any = [];

  displayedColumns = ['id', 'descripcion', 'horaInicio', 'horaFinal', 'estado', 'tipoTurno', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioTurno: TurnosService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioTurno.listarTodos().subscribe( res =>{
      this.listarTurnos = res;
      this.dataSource = new MatTableDataSource( this.listarTurnos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  eliminarTurnos(id:number){
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
        this.servicioTurno.eliminar(id).subscribe(res=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el turno.',
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
  name = 'listaTurnos.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('turnos');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }
}
