const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const cors = require('cors');
const churnRoutes = require('./routes/chrun.routes');
const customerRoutes = require("./routes/customer.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/churn', churnRoutes);
app.use("/api/customers", customerRoutes);

dotenv.config();

connectDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
