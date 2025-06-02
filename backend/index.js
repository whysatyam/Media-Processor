require("dotenv").config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
require("./models/db");

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
