exports.validateChurnInput = (req, res, next) => {
    const requiredFields = [
        "tenure",
        "MonthlyCharges",
        "TotalCharges",
        "InternetService",
        "OnlineSecurity",
        "OnlineBackup",
        "TechSupport",
        "Contract",
        "PaymentMethod",
    ];

    for (let field of requiredFields) {
        if (req.body[field] === undefined) {
            return res.status(400).json({ error: `${field} is required.` });
        }
    }

    next();
};