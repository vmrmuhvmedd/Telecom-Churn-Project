const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerID: { type: String, required: true, unique: true },
    gender: String,
    SeniorCitizen: Number,
    Partner: String,
    Dependents: String,
    tenure: Number,
    PhoneService: String,
    MultipleLines: String,
    InternetService: String,
    OnlineSecurity: String,
    OnlineBackup: String,
    DeviceProtection: String,
    TechSupport: String,
    StreamingTV: String,
    StreamingMovies: String,
    Contract: String,
    PaperlessBilling: String,
    PaymentMethod: String,
    MonthlyCharges: Number,
    TotalCharges: String,
    Churn: String,
    Tenure_Group: String,
});

module.exports = mongoose.model("Customer", customerSchema);
