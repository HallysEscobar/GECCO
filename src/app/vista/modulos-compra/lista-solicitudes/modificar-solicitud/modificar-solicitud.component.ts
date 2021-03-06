import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetalleSolicitud } from 'src/app/modelos/detalleSolicitud';
import { Solicitud } from 'src/app/modelos/solicitud';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DetalleSolicitudService } from 'src/app/servicios/detalleSolicitud.service';
import { SolicitudService } from 'src/app/servicios/solicitud.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { EstadoService } from 'src/app/servicios/estado.service';
import { ArticuloService } from 'src/app/servicios/articulo.service';
import { Observable, startWith, map } from 'rxjs';
import { Articulo } from './../../../../modelos/articulo';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-solicitud',
  templateUrl: './modificar-solicitud.component.html',
  styleUrls: ['./modificar-solicitud.component.css']
})
export class ModificarSolicitudComponent implements OnInit {

  public formSolicitud!: FormGroup;
  public articulos = new FormControl<string | Articulo>("");
  filteredOptions!: Observable<Articulo[]>;
  public listaArticulos: any = [];
  public listaArticulosDetalle: any = [];
  public listaArticulo: any = [];
  public articulosDisponibles:any = [];
  public listadoArtSel: any = [];

  public listadoSolicitud: any = [];

  public listaNumeros: any = [];
  public list: any = {};
  public listaRow: any = [];

  color = ('primary');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private servicioArticulo: ArticuloService,
    private servicioEstado: EstadoService,
    private servicioSolicitud: SolicitudService,
    private servicioDetalleSolicitud: DetalleSolicitudService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    public dialogRef: MatDialogRef<ModificarSolicitudComponent>,
  ){}


  ngOnInit(): void {
    this.listarArticulos();
    this.crearFormulario()
  }

  private crearFormulario() {
    this.formSolicitud = this.fb.group({
      id: 0,
      cantidad: [null,Validators.required],
      observacion: [null,Validators.required],
    });
  }

  public listarArticulos() {
    this.servicioDetalleSolicitud.listarTodos().subscribe(resDetalleSolicitud=>{
      resDetalleSolicitud.forEach(element => {
        if(element.idSolicitud.id == Number(this.data)){
          this.listaArticulosDetalle.push(element)
        }
      });
      console.log(this.listaArticulosDetalle)
      this.listadoArtSel = this.listaArticulosDetalle
      console.log(this.listadoArtSel)
      this.dataSource = new MatTableDataSource( this.listadoArtSel);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.servicioArticulo.listarTodos().subscribe(res => {
      res.forEach(element => {
        if(element.idEstado.id == 26){
          this.articulosDisponibles.push(element)
        }
      });
      this.listaArticulos = this.articulosDisponibles
      this.filteredOptions = this.articulos.valueChanges.pipe(
        startWith(""),
        map(value => {
          const descripcion = typeof value == 'string' ? value : value?.descripcion;
          return descripcion ? this._filter(descripcion as string, this.listaArticulos) : this.listaArticulos.slice();
        }),
      );
    });
  }
  public guardar() {
    var encontrado = false
    const listaEncontrado: any = []
    const cantidad = this.formSolicitud.controls['cantidad'].value
    const observacion = this.formSolicitud.controls['observacion'].value
    if(this.articulo == undefined || cantidad == null || observacion == null){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El campo esta vacio!',
        showConfirmButton: false,
        timer: 1500
      })
    }else{
      var obj = {
        idArticulos: this.articulo,
        cantidad: cantidad,
        observacion: observacion
      }
      if(this.listadoArtSel.length<1){
        this.listadoArtSel.push(obj)
      }else if(this.listadoArtSel.length>=1){
        this.listadoArtSel.forEach((element:any) => {
          if(element.idArticulos.id == obj.idArticulos.id){
            encontrado = true
          }
          else if(element.idArticulos.id != obj.idArticulos.id){
            encontrado = false
          }
          listaEncontrado.push(encontrado)
        });
        const existe = listaEncontrado.includes( true )
        console.log(existe)
        if(existe == false){
          this.listadoArtSel.push(obj)
        }else if(existe == true){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ese elemento ya existe.',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
      this.dataSource = new MatTableDataSource( this.listadoArtSel);
    }
  }

  textoArticulo:any
  displayFn(articulo: Articulo): any {
    this.textoArticulo = articulo
    if(this.textoArticulo == ""){
      this.textoArticulo = " "
    }else{
      this.textoArticulo = articulo.descripcion
      return this.textoArticulo;
    }
  }

  public _filter(descripcion: string, listaArticulos: any): Articulo[] {

    const filterValue = descripcion.toLowerCase();

    return listaArticulos.filter((listaArticulos:any) => (listaArticulos.descripcion.toLowerCase().includes(filterValue)));
  }

  articulo:any
  capturarArticulo(event:MatAutocompleteSelectedEvent){
    this.articulo = event.option.value
  }

  displayedColumns: string[] = ['select', 'articulo', 'cantidad', 'observacion'];
  dataSource = new MatTableDataSource<Articulo>();
  selection = new SelectionModel<Articulo>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  seleccionados:any
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
    this.listaRow = this.listadoArtSel
  }

  toggle(event:any, row: any) {
    this.list = row
    console.log(event, row, this.listaRow)

    console.log(event.checked, this.list.id)
    var obj = {
      articulo: [],
      seleccionado: Boolean
    }
    var encontrado = false
    const listaEncontrado: any = []
    if(this.listaRow.length>=1 ){
      for (let index = 0; index < this.listaRow.length; index++) {
        const element = this.listaRow[index];
        if(element.articulo.articulo.id == this.list.articulo.id){
          console.log(element.seleccionado, event.checked)
          if(element.seleccionado == true && event.checked == false){
            var posicion = this.listaRow.indexOf(element)
            this.listaRow.splice(posicion, 1)
            break
          }
        }else if(element.articulo.articulo.id != this.list.articulo.id && event.checked == true){
          obj.articulo = this.list
          obj.seleccionado = event.checked
          this.listaRow.push(obj)
          break
        }
      }
    }else{
      if(event.checked == true){
        obj.articulo = this.list
        obj.seleccionado = event.checked
        this.listaRow.push(obj)
      }
    }
    console.log(this.listaRow)
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Articulo): string {
    var encontrado = false
    const listaEncontrado: any = []
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1},`+this.selection.isSelected(row)+` estas son: `+row;
  }

  public eliminarArticulo(){
    if(this.listaRow.length == this.listadoArtSel.length){
      this.listadoArtSel = []
      this.dataSource = new MatTableDataSource( this.listadoArtSel);
    }else{
      this.listaRow.forEach((element:any) => {
        for (let i in this.listadoArtSel) {
          if (this.listadoArtSel[i].idArticulos.id == element.articulo.idArticulos.id) {
            this.listadoArtSel.splice(i, 1)
          }
        }
      });
      this.dataSource = new MatTableDataSource( this.listadoArtSel);
    }
  }

  public limpiar(){
    this.listadoArtSel = []
  }

  public generarSolicitud(){
    document.getElementById('snipper')?.setAttribute('style', 'display: block;')
    this.servicioSolicitud.listarPorId(Number(this.data)).subscribe(resSolicitud=>{
      let solicitud : Solicitud = new Solicitud();
      solicitud.id = resSolicitud.id
      solicitud.fecha = resSolicitud.fecha
      this.servicioEstado.listarPorId(28).subscribe(resEstado=>{
        solicitud.idEstado = resEstado
        solicitud.idUsuario = resSolicitud.idUsuario
        this.actualizarSolicitud(solicitud, solicitud.id)
      })
    })
  }

  public actualizarSolicitud(solicitud: Solicitud, idSolicitud:number){
    this.servicioSolicitud.actualizar(solicitud).subscribe(res=>{
      this.detalleSolicitud(idSolicitud)
    }, error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }

  public detalleSolicitud(idSolicitud:number){
    var validar = true
    this.servicioDetalleSolicitud.listarTodos().subscribe(resDetalleSolicitud=>{
      resDetalleSolicitud.forEach(element => {
        if(element.idSolicitud.id == idSolicitud){
          this.servicioDetalleSolicitud.eliminar(element.id).subscribe(resDetalleSolicitud=>{
            console.log("listo")
          })
        }
      });
    })
    console.log(this.listadoArtSel)
    this.listadoArtSel.forEach((element:any) => {
      let detalleSolicitud : DetalleSolicitud = new DetalleSolicitud();
      detalleSolicitud.idArticulos = element.idArticulos
      this.servicioSolicitud.listarPorId(idSolicitud).subscribe(resSolicitud=>{
        detalleSolicitud.idSolicitud = resSolicitud
        detalleSolicitud.valorUnitario = 0
        detalleSolicitud.cantidad = element.cantidad
        detalleSolicitud.valorTotal = 0
        detalleSolicitud.observacion = element.observacion
        this.servicioEstado.listarPorId(28).subscribe(resEstado=>{
          detalleSolicitud.idEstado = resEstado
          this.servicioDetalleSolicitud.registrar(detalleSolicitud).subscribe(res=>{
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se modifico la solicitud!',
              showConfirmButton: false,
              timer: 1500
            })
            window.location.reload()
            this.dialogRef.close();
          }, error => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Hubo un error al agregar!',
              showConfirmButton: false,
              timer: 1500
            })
          });
        })
      })
    });
  }

}
