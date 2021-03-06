import { Articulo } from '../../../../modelos/articulo';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EstadoService } from 'src/app/servicios/estado.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/servicios/articulo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-articulos',
  templateUrl: './modificar-articulos.component.html',
  styleUrls: ['./modificar-articulos.component.css']
})
export class ModificarArticulosComponent implements OnInit {

  public formArticulo!: FormGroup;
  public idArticulo : any;
  public listaArticulo : any = [];
  public listarEstado : any = [];
  public estadosDisponibles : any = [];
  public listaEstados: any = [];
  color = ('primary');

  constructor(
    private servicioArticulo: ArticuloService,
    private servicioEstado: EstadoService,
    public dialogRef: MatDialogRef<ModificarArticulosComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarporidArticulo();
    this.listaEstado();
  }

  private crearFormulario() {
    this.formArticulo = this.fb.group({
      id: [''],
      descripcion: [null,Validators.required],
      estado: [null,Validators.required],
    });
  }

  public listaEstado() {
    this.servicioEstado.listarTodos().subscribe(res => {
      res.forEach(element => {
        if(element.idModulo.id == 22){
          this.estadosDisponibles.push(element)
        }
      });
      this.listarEstado = this.estadosDisponibles
  })
  ;}

  public listarporidArticulo() {
    this.idArticulo = this.data;
    this.servicioArticulo.listarPorId(this.idArticulo).subscribe(res => {
      this.listaArticulo = res;
      this.formArticulo.controls['id'].setValue(this.listaArticulo.id);
      this.formArticulo.controls['descripcion'].setValue(this.listaArticulo.descripcion);
      this.formArticulo.controls['estado'].setValue(this.listaArticulo.idEstado.id);
    })
  }

  public guardar() {
    let articulo : Articulo = new Articulo();
    articulo.id=Number(this.data);
    articulo.descripcion=this.formArticulo.controls['descripcion'].value;
    const idEstado = this.formArticulo.controls['estado'].value;
    this.servicioEstado.listarPorId(idEstado).subscribe(res => {
      articulo.idEstado = res
      if(articulo.descripcion==null || articulo.descripcion=="" || articulo.idEstado==null){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El campo esta vacio!',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        this.actualizarArticulo(articulo);
      }
    })
  }

  public actualizarArticulo(articulo: Articulo) {
    this.servicioArticulo.actualizar(articulo).subscribe(res => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Rol modificado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      window.location.reload();
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

}
