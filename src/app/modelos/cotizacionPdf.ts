import { Estado } from './estado';
import { Cotizacion } from './cotizacion';

export class CotizacionPdf {
  public id: number=0;
  public nombrePdf : String = "";
  idCotizacion !: Cotizacion;
  idEstado!: Estado;
}
