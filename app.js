const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

require('./models/feature.model');

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/plans', require('./routes/plan.routes'));
app.use('/api/orders', require('./routes/order.routes'));
// app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/tickets', require('./routes/ticket.routes'));
app.use('/api/addons', require('./routes/addon.routes'));
// app.use('/api/order-addons', require('./routes/orderAddon.routes'));
app.use('/api/features', require('./routes/feature.routes'));

app.get('/', (req, res) => {
  res.send('🚀 Server API is running...');
});

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
