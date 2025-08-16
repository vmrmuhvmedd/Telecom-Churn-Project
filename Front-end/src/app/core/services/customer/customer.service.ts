import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICustomer } from '../../../shared/models/icustomer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.baseUrl}/customers`;

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(this.apiUrl);
  }
}
