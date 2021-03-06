import { Categoria } from './../modelos/categoria';
import { SharedService } from 'src/app/shared.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private path = this.sharedService.APIUrl+'/Categoria';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<Categoria[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<Categoria>(this.path+'/ObtenerId/'+id);
  }

  public registrar(categoria: Categoria){
    return this.http.post<void>(this.path+'/Guardar',categoria);
  }

  public actualizar(categoria: Categoria){
    return this.http.put<void>(this.path+'/Modificar/'+ categoria.id,categoria);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
