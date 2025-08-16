import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChurnRequest, IChurnResponse } from '../../../shared/models/ichurnRequest';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = `${environment.baseUrl}/churn/predict`;

  constructor(private http: HttpClient) { }

  predict(data: IChurnRequest): Observable<IChurnResponse> {
    return this.http.post<IChurnResponse>(this.apiUrl, data);
  }
}
