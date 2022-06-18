import { AsignarTurnoVendedorService } from 'src/app/servicios/asignarTurnoVendedor.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AsignarTurno } from 'src/app/modelos/asignarTurno';
import { AsignarTurnoService } from 'src/app/servicios/asignarTurno.service';
import { EstadoService } from 'src/app/servicios/estado.service';
import { OficinasService } from 'src/app/servicios/serviciosSiga/oficinas.service';
import { SitioVentaService } from 'src/app/servicios/serviciosSiga/sitioVenta.service';
import { UsuarioVendedoresService } from 'src/app/servicios/serviciosSiga/usuariosVendedores.service';
import { TurnosService } from 'src/app/servicios/turnos.service';
import Swal from 'sweetalert2';
import { AsignarTurnoVendedor } from 'src/app/modelos/asignarTurnoVendedor';

@Component({
  selector: 'app-agregar-asignar-turno-vendedor',
  templateUrl: './agregar-asignar-turno-vendedor.component.html',
  styleUrls: ['./agregar-asignar-turno-vendedor.component.css']
})
export class AgregarAsignarTurnoVendedorComponent implements OnInit {

  dtOptions: any = {};
  public formAsignarTurno!: FormGroup;
  public listarVendedores: any = [];
  public listarSitioVenta:any=[];
  public listarEstado: any = [];
  public listaOficinas: any = [];
  public listarTurnos: any = [];
  public listaTurno: any = [];
  public listaIdSitioVenta: any = [];
  public listarSitioVentas: any = [];
  public estadosDisponibles: any = [];
  public listaIdOficinas: any = [];

  public listaVendedores:any =[];
  public listaIdVendedor:any=[];

  public listaSitioVentaTabla:any=[];
  public listaSitioVentasTabla:any=[]


  displayedColumns = ['id', 'nombreVendedor', 'nombreOficina', 'nombreSitioVenta', 'fechaInicio', 'fechaFinal', 'turno', 'opciones'];
  dataSource!:MatTableDataSource<any>;

  constructor(
    private fb: FormBuilder,
    private servicioAsignarTurno : AsignarTurnoService,
    private servicioEstado : EstadoService,
    private servicioOficina : OficinasService,
    private servicioTurnos : TurnosService,
    private servicioSitioVenta : SitioVentaService,
    private servicioUsuarioVendedor: UsuarioVendedoresService,
    private servicioAsigarTurnoVendedor: AsignarTurnoVendedorService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarOficinas();
  }
  private crearFormulario() {
    this.formAsignarTurno = this.fb.group({
      id: 0,
      oficina: [null,Validators.required],
      sitioVenta: [null,Validators.required],
      turno: [null,Validators.required],
      vendedor: [null,Validators.required],
      fechaInicio: [null,Validators.required],
      fechaFinal: [null,Validators.required],
    });
  }

  public listarEstados() {
    this.servicioEstado.listarTodos().subscribe(res => {
      res.forEach(element => {
        if (element.idModulo.id == 6) {
          this.estadosDisponibles.push(element);
        }
        this.listarEstado = this.estadosDisponibles
      })

    });
  }

  public listarOficinas() {
    this.servicioOficina.listarTodos().subscribe(res => {
      this.listaOficinas = res
    });
  }

  id: any // Id de la oficina capturado - 18

  idOficina(){
    this.listarSitioVenta = []
    const listaOficina = this.id
    this.listaIdOficinas.push(listaOficina.ideOficina)
    let ultimo = this.listaIdOficinas[this.listaIdOficinas.length - 1]
    let penultimo = this.listaIdOficinas[this.listaIdOficinas.length - 2]
    if(ultimo != penultimo || penultimo == undefined){
      this.servicioSitioVenta.listarPorId(ultimo).subscribe(res=>{
        this.listarSitioVentas = res
      })
      this.servicioUsuarioVendedor.listarPorId(ultimo).subscribe(res=>{
        this.listarVendedores = res
        console.log
      })
    }else{
      console.log("todo igual")
    }
  }

  idSitioVenta: any // Id de la oficina capturado - 18

  public idSitiosVentas(){
    this.listaTurno = [];
    this.listarTurnos = [];
    const listaSitioVenta = this.idSitioVenta
    this.listaIdSitioVenta.push(listaSitioVenta.ideSitioventa)
    let ultimo = this.listaIdSitioVenta[this.listaIdSitioVenta.length - 1]
    let penultimo = this.listaIdSitioVenta[this.listaIdSitioVenta.length - 2]
    if(ultimo != penultimo || penultimo == undefined){
      this.servicioAsignarTurno.listarTodos().subscribe(res=>{
      this.listaSitioVentaTabla =[]
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if (element.idSitioVenta == ultimo){
            this.servicioTurnos.listarTodos().subscribe(res=>{
              res.forEach(turnos => {
                if(turnos.id == element.idTurnos.id){
                  this.listaTurno.push(element);
                }
              });
              this.listarTurnos = this.listaTurno
              console.log(this.listarTurnos)
            })
          }
        }
      })
    }else{
      console.log("todo igual")
    }
  }

  idVendedor: any
  public idVendedortabla(){
    const listaVendedores = this.idVendedor
    console.log(listaVendedores)
    this.listaIdVendedor.push(listaVendedores.ideUsuario)
    console.log(this.listaIdVendedor)
    let ultimo = this.listaIdVendedor[this.listaIdVendedor.length - 1]
    let penultimo = this.listaIdVendedor[this.listaIdVendedor.length - 2]
    if(ultimo != penultimo || penultimo == undefined){
      this.servicioAsigarTurnoVendedor.listarTodos().subscribe(res=>{
        this.listaSitioVentaTabla =[]
        console.log(res)
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if(element.idVendedor == ultimo){
            this.listaSitioVentaTabla.push(element)
          }
        }
        this.listaSitioVentasTabla = this.listaSitioVentaTabla
        console.log(this.listaSitioVentasTabla)
        this.dataSource = new MatTableDataSource(this.listaSitioVentasTabla);
      })
    }
  }

  public guardar() {
    let asignarTurnoVendedor : AsignarTurnoVendedor = new AsignarTurnoVendedor();
    const idOficina = this.formAsignarTurno.controls['oficina'].value
    this.servicioOficina.listarTodos().subscribe(res => {
      res.forEach(element => {
        if(element.ideOficina == idOficina.ideOficina){
          asignarTurnoVendedor.idOficina = Number(element.ideOficina)
          asignarTurnoVendedor.nombreOficina = element.nom_oficina
          this.servicioSitioVenta.listarPorId(element.ideOficina).subscribe(resSitioVenta=>{
            const idSitioVenta = this.formAsignarTurno.controls['sitioVenta'].value
            resSitioVenta.forEach(elementSitioVenta => {
              if(elementSitioVenta.ideSitioventa == idSitioVenta.ideSitioventa){
                asignarTurnoVendedor.idSitioVenta == Number(elementSitioVenta.ideSitioventa)
                asignarTurnoVendedor.nombreSitioVenta == elementSitioVenta.nom_sitioventa
                this.servicioUsuarioVendedor.listarPorId(element.ideOficina).subscribe(resUsuarioVendedor=>{
                  const idUsuarioVendedor = this.formAsignarTurno.controls['vendedor'].value
                  resUsuarioVendedor.forEach(elementUsuarioVendedor => {
                    if(elementUsuarioVendedor.ideUsuario == idUsuarioVendedor.ideUsuario){
                      asignarTurnoVendedor.idVendedor = elementUsuarioVendedor.ideUsuario
                      asignarTurnoVendedor.nombreVendedor = elementUsuarioVendedor.nombres+" "+elementUsuarioVendedor.apellido1
                      console.log(asignarTurnoVendedor.nombreVendedor)
                      const idTurno = this.formAsignarTurno.controls['turno'].value
                      this.servicioTurnos.listarPorId(idTurno).subscribe(resTurno=>{
                        asignarTurnoVendedor.idTurno = resTurno
                        // asignarTurnoVendedor.horaInicio =
                        // asignarTurnoVendedor.horaFinal =
                      })
                    }
                  });
                })
              }
            });
          })
        }
      });
    })

    // let asignarTurno : AsignarTurno = new AsignarTurno();
    // this.servicioEstado.listarTodos().subscribe(res => {
    //   res.forEach(element => {
    //     if (element.id == 13) {
    //       asignarTurno.idEstado = element;
    //       const idOficina = this.formAsignarTurno.controls['oficina'].value
    //       this.servicioOficina.listarTodos().subscribe(res => {
    //         for (let index = 0; index < res.length; index++) {
    //           const element = res[index];
    //           if(element.ideOficina == idOficina.ideOficina){
    //             asignarTurno.idOficina = element.ideOficina
    //             asignarTurno.nombreOficina = element.nom_oficina
    //             const idSitioVenta = this.formAsignarTurno.controls['sitioVenta'].value
  }

  public registrarAsignacionTurno(asignarTurno: AsignarTurno) {
  }

  public eliminarAsignarTurno(id:number){
  }

}
