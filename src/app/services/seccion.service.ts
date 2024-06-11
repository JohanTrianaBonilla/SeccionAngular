import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Timestamp } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  private myAppUrl = 'https://localhost:7295/';
  private myApiUrl = 'api/Seccion/';
  constructor(private http : HttpClient) { }
  
  getListarSeccion(): Observable<any>
  {
    console.log("Ruta->",this.myAppUrl + this.myApiUrl );
    return this.http.get(this.myAppUrl + this.myApiUrl);
  }
  deleteSeccion(id:string):Observable<any>
  {
    //return this.http.delete(this.myAppUrl + this.myApiUrl + id);
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}${id}`, { responseType: 'text' });
  }

  saveSeccion(seccion: any): Observable<any> {

    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   // return this.http.post<any>(this.myAppUrl + this.myApiUrl, seccion, { responseType: 'text' });
    return this.http.post(this.myAppUrl + this.myApiUrl, seccion, { responseType: 'text' });
  }

  editarSeccion(Id: string, seccion: any): Observable<any> {
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //return this.http.put<any>(this.myAppUrl + this.myApiUrl + Id, seccion, { headers });
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}${Id}`, seccion, { responseType: 'text' });
  }
}
