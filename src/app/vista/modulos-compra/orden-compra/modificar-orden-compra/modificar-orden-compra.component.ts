import { DetalleSolicitud } from './../../../../modelos/detalleSolicitud';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable} from 'rxjs';
import { OrdenCompra } from 'src/app/modelos/ordenCompra';
import { Proveedor } from 'src/app/modelos/proveedor';
import { Solicitud } from 'src/app/modelos/solicitud';
import { DetalleSolicitudService } from 'src/app/servicios/detalleSolicitud.service';
import { EstadoService } from 'src/app/servicios/estado.service';
import { OrdenCompraService } from 'src/app/servicios/ordenCompra.service';
import { SolicitudService } from 'src/app/servicios/solicitud.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-modificar-orden-compra',
  templateUrl: './modificar-orden-compra.component.html',
  styleUrls: ['./modificar-orden-compra.component.css']
})
export class ModificarOrdenCompraComponent implements OnInit {
  public proveedores = new FormControl<string | Proveedor>("");
  public formProveedor!: FormGroup;
  public lista: any = []
  public list: any = [];
  public listaRow: any = [];
  public opciones: any = ['Si', 'No'];
  filteredOptions!: Observable<Proveedor[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  color = ('primary');
  constructor(
    private fb: FormBuilder,
    private servicioDetalleSolicitud: DetalleSolicitudService,
    private servicioEstado: EstadoService,
    private servicioSolicitud: SolicitudService,
    private servicioOrdenCompra: OrdenCompraService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModificarOrdenCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
  ) { }

  ngOnInit(): void {
    this.crearFormulario()
    this.listarTodo()

  }

  crearFormulario(){
    this.formProveedor = this.fb.group({
      id: 0,
      antici: [null,Validators.required],
    });
  }

  public listarTodo(){
    for (const [key, value] of Object.entries(this.data)) {
      this.list.push(value)
    }
    this.servicioOrdenCompra.listarPorId(this.list[1]).subscribe(resordenCompra=>{
      this.formProveedor.setValue({
        id: resordenCompra.id,
        antici: resordenCompra.anticipoPorcentaje,
      })
      this.total = resordenCompra.valorAnticipo
      this.subtotal = resordenCompra.subtotal
      if(resordenCompra.anticipoPorcentaje != 0){
        document.getElementById('antici')?.setAttribute('value', String(resordenCompra.anticipoPorcentaje))
        console.log(resordenCompra)
        this.opciones = ['Si']
        this.anticipoVal2 = resordenCompra.anticipoPorcentaje
        this.descuento = resordenCompra.descuento
      }else if(resordenCompra.anticipoPorcentaje == 0){
        this.opciones = ['No']
        this.anticipoVal2 = 0
        this.descuento = 0
      }
      document.getElementById('proveedortra')?.setAttribute('value', resordenCompra.idProveedor.nombre)
      this.servicioSolicitud.listarPorId(resordenCompra.idSolicitud.id).subscribe(resSolicitud=>{
        console.log(resSolicitud)
        this.servicioDetalleSolicitud.listarTodos().subscribe(resDetalleSolicitud=>{
          resDetalleSolicitud.forEach(element => {
            if(element.idSolicitud.id == resSolicitud.id){
              this.listaRow.push(element)
            };
          })
          console.log(this.listaRow)
          this.dataSource = new MatTableDataSource(this.listaRow);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      })
    })


    $('#tabla tbody tr').each(function(){
      var input = $(this).find('input[type="number"]').attr('value');
      var valorTotal = $(this).find("td").eq(5).attr('value');
      console.log(input)
    });
  }
  solicitudDetalle:any
  ultimaPosicion:any
  subtotal:any
  anticipoVal:any
  anticipoVal2:any
  descuento:any
  total:any
  valorUnitario(valor:any, solicitudDetalle:any){
    console.log(solicitudDetalle, valor.target.value)
    for (let index = 0; index < this.listaRow.length; index++) {
      const element = this.listaRow[index];
      if(element.idArticulos.id == solicitudDetalle.idArticulos.id){
        element.valorUnitario = valor.target.value
        element.valorTotal = element.valorUnitario * element.cantidad
        element.cantidad = element.cantidad
        element.id = element.id
        element.idArticulos = element.idArticulos
        element.idEstado = element.idEstado
        element.idSolicitud = element.idSolicitud
        element.observacion = element.observacion
        this.lista.splice(index,1)
      }
    }
    this.subtotal = 0
    this.listaRow.forEach((element:any) => {
      this.subtotal += element.valorTotal

    });
    if(this.anticipoVal2 == 0){
      this.anticipoVal = 0
      this.anticipoVal2 = 0
      this.total = this.subtotal
    }else if(this.anticipoVal2!=0){
      this.anticipoVal = this.anticipoVal2/100
      this.anticipoVal2 = this.anticipoVal2
      this.descuento = this.subtotal * this.anticipoVal
      this.total = this.subtotal - this.descuento

    }
  }

  generarOrden(){
    document.getElementById('snipper')?.setAttribute('style', 'display: block;')
    var idSolicitud  = 0
    this.listaRow.forEach((element:any) => {
      idSolicitud = element.idSolicitud.id
    })
    this.servicioSolicitud.listarPorId(idSolicitud).subscribe(resSolicitud=>{
        let solicitud : Solicitud = new Solicitud();
        solicitud.id = resSolicitud.id
        solicitud.fecha = resSolicitud.fecha
        this.servicioEstado.listarPorId(37).subscribe(resEstado=>{
          solicitud.idEstado = resEstado
          solicitud.idUsuario = resSolicitud.idUsuario
          this.actualizarSolicitud(solicitud, solicitud.id)
        })
    })
  }

  public actualizarSolicitud(solicitud:Solicitud, idSolicitud){
    this.servicioSolicitud.actualizar(solicitud).subscribe(resSolicitud=>{
      for (const [key, value] of Object.entries(this.data)) {
        this.list.push(value)
      }
      this.servicioOrdenCompra.listarPorId(this.list[1]).subscribe(resOrdenCompra=>{
        let ordenCompra : OrdenCompra = new OrdenCompra();
        ordenCompra.id = resOrdenCompra.id
        ordenCompra.subtotal = this.subtotal
        ordenCompra.descuento = this.descuento
        ordenCompra.valorAnticipo = this.total
        ordenCompra.anticipoPorcentaje = this.anticipoVal2
        ordenCompra.idProveedor = resOrdenCompra.idProveedor
        ordenCompra.idSolicitud = solicitud
        this.servicioEstado.listarPorId(43).subscribe(resEstado=>{
          ordenCompra.idEstado = resEstado
          this.actualizarOrdenCompra(ordenCompra, idSolicitud)
        })
      })
    }, error => {
      console.log(error)
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al actualizar la solicitud!',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }

  public actualizarOrdenCompra(ordenCompra: OrdenCompra, idSolicitud){
    this.servicioOrdenCompra.actualizar(ordenCompra).subscribe(resOrdenCOmpra=>{
      this.listaRow.forEach(element => {
        let detalleSolicitud : DetalleSolicitud = new DetalleSolicitud()
        detalleSolicitud.id = element.id
        detalleSolicitud.cantidad = element.cantidad
        detalleSolicitud.idArticulos = element.idArticulos
        detalleSolicitud.idSolicitud = element.idSolicitud
        detalleSolicitud.observacion = element.observacion
        detalleSolicitud.valorTotal = element.valorTotal
        detalleSolicitud.valorUnitario = element.valorUnitario
        this.servicioEstado.listarPorId(37).subscribe(resEstado=>{
          detalleSolicitud.idEstado = resEstado
          this.actualizarDetalleSolicitud(detalleSolicitud)
        })
      });
    })
  }

  public actualizarDetalleSolicitud(detalleSolicitud: DetalleSolicitud){
    this.servicioDetalleSolicitud.actualizar(detalleSolicitud).subscribe(resDetalleSolicitud=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha modificado su orden de compra con exito.',
        showConfirmButton: false,
        timer: 1500
      })
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      window.location.reload()
      this.dialogRef.close();
    })
  }

  displayedColumns: string[] = ['articulo', 'cantidad', 'valorUnitario', 'valorTotal'];
  dataSource = new MatTableDataSource<Proveedor>();
  selection = new SelectionModel<Proveedor>(true, []);

  name = 'ordenCompra.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('rol');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

}
