
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const myFirstSecret = process.env.FIRST_SECRET_KEY;
if (!myFirstSecret) {
    console.error("JWT Secret Key is not defined in .env");
    process.exit(1); 
}
console.log("JWT Secret Key:", myFirstSecret);


require('./config/mongoose.config');


require('./routes/foodDelivery.routes')(app);
require('./routes/user.routes')(app);
require('./routes/foodItem.routes')(app);
require('./routes/order.routes')(app);

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
