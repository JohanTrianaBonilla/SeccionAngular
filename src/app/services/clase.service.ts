import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Timestamp } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private myAppUrl = 'https://localhost:7295/';
  private myApiUrl = 'api/Clase/';
  constructor(private http : HttpClient) { }

  getListarClase(): Observable<any> {
    console.log("Ruta ->", this.myAppUrl + this.myApiUrl);
    return this.http.get(this.myAppUrl + this.myApiUrl);
  }
}
