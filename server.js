require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const authRouter = require("./routes/auth-routes");
const homeRouter = require("./routes/home-routes");
const adminRouter = require("./routes/admin-routes");
const uploadImageRouter = require("./routes/image-routes");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/image", uploadImageRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
