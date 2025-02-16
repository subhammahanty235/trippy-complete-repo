require('dotenv').config();
const express = require('express')
const cors = require('cors');
const {connectDB} = require('./config/database')
const {initModals} = require('./models/index')
const db = require('./models')
const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", require('./routes/auth.route'))
app.use("/api/v1/connection", require("./routes/connection.route"))
app.use("/api/v1/trip", require("./routes/trip.route"))
app.use("/api/v1/expense" , require("./routes/expense.route"))
app.use('/api/v1/user', require('./routes/user.route'))
app.use("/api/v1/azure/storage" , require('./routes/azurestorage.route'))
app.use("/api/v1/payments" , require('./routes/payment.route'))
// db.sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("Database synchronized successfully.");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

const PORT = process.env.PORT || 5050;
app.listen(PORT , ()=>{
    console.log("App is running on port "+ PORT)
})
