export interface IChurnRequest {
  tenure: number;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  TechSupport: string;
  Contract: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

export interface IChurnResponse {
  prediction: boolean;
  probability: number;
  threshold: number;
}
