import { AsignarTurnoVendedor } from './../../../modelos/asignarTurnoVendedor';
import { SolicitudEliminarTurnoVendedorComponent } from './solicitud-eliminar-turno-vendedor/solicitud-eliminar-turno-vendedor.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AsignarTurnoVendedorService } from 'src/app/servicios/asignarTurnoVendedor.service';
import { UsuarioVendedoresService } from 'src/app/servicios/serviciosSiga/usuariosVendedores.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { UsuarioService } from 'src/app/servicios/usuario.service';
@Component({
  selector: 'app-asignar-turno-vendedor',
  templateUrl: './asignar-turno-vendedor.component.html',
  styleUrls: ['./asignar-turno-vendedor.component.css']
})
export class AsignarTurnoVendedorComponent implements OnInit {

  dtOptions: any = {};
  public listaAsignarTurnoVendedor: any = [];
  public listaAsigVen: any = [];


  displayedColumns = ['id', 'nombreVendedor', 'nombreOficina', 'nombreSitioVenta', 'fechaInicio', 'fechaFinal', 'turno'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private servicioAsignarTurnoVendedor: AsignarTurnoVendedorService,
    private servicioUsuarioVendedor: UsuarioVendedoresService
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioAsignarTurnoVendedor.listarTodos().subscribe( res =>{
      res.forEach(element => {
        if(element.estado != "Eliminado"){
          this.listaAsigVen.push(element)
        }
      });
      this.listaAsignarTurnoVendedor = this.listaAsigVen;
      this.dataSource = new MatTableDataSource( this.listaAsignarTurnoVendedor);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public botonActualizar(){
    this.servicioAsignarTurnoVendedor.listarTodos().subscribe( res =>{
      res.forEach(element => {
        if(element.estado == ""){
          let asignarTurnoVendedor : AsignarTurnoVendedor = new AsignarTurnoVendedor();
          asignarTurnoVendedor.estado = "Disponible"
          asignarTurnoVendedor.fechaFinal = element.fechaFinal
          asignarTurnoVendedor.fechaInicio = element.fechaInicio
          asignarTurnoVendedor.id = element.id
          asignarTurnoVendedor.idOficina = element.idOficina
          asignarTurnoVendedor.idSitioVenta = element.idSitioVenta
          asignarTurnoVendedor.idTurno = element.idTurno
          asignarTurnoVendedor.idVendedor = element.idVendedor
          asignarTurnoVendedor.ideSubzona = element.ideSubzona
          asignarTurnoVendedor.nombreOficina = element.nombreOficina
          asignarTurnoVendedor.nombreSitioVenta = element.nombreSitioVenta
          asignarTurnoVendedor.nombreVendedor = element.nombreVendedor
          this.actualizarTurnoVendedor(asignarTurnoVendedor)
        }
      });
    })
  }

  public actualizarTurnoVendedor(asignarTurnoVendedor: AsignarTurnoVendedor){
    this.servicioAsignarTurnoVendedor.actualizar(asignarTurnoVendedor).subscribe(res => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Actualizado!',
        showConfirmButton: false,
        timer: 1500
      })
    }, error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al modificar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }

  // Filtrado
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  name = 'listaAsignarTurnoVendedor.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('asignarTurnoVendedor');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

}
