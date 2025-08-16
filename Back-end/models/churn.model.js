const mongoose = require("mongoose");

const churnSchema = new mongoose.Schema(
    {
        tenure: { type: Number, required: true },
        MonthlyCharges: { type: Number, required: true },
        TotalCharges: { type: Number, required: true },
        InternetService: {
            type: String,
            enum: ["DSL", "Fiber optic", "No"],
            required: true,
        },
        OnlineSecurity: {
            type: String,
            enum: ["No", "Yes", "No internet service"],
            required: true,
        },
        OnlineBackup: {
            type: String,
            enum: ["No", "Yes", "No internet service"],
            required: true,
        },
        TechSupport: {
            type: String,
            enum: ["No", "Yes", "No internet service"],
            required: true,
        },
        Contract: {
            type: String,
            enum: ["Month-to-month", "One year", "Two year"],
            required: true,
        },
        PaymentMethod: {
            type: String,
            enum: [
                "Electronic check",
                "Mailed check",
                "Bank transfer (automatic)",
                "Credit card (automatic)",
            ],
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Churn", churnSchema);
