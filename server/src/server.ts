import express, { Application } from "express";
import itemsRoutes from "./routes/items";
import usersRoutes from "./routes/users";
import dotenv from "dotenv";
import lostReportsRoutes from "./routes/lost_reports";
import ownershipClaimsRoutes from "./routes/ownershipClaims";

dotenv.config(); // Ładowanie zmiennych z pliku .env

const app: Application = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Routes
app.use("/api/items", itemsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ownership-claims", ownershipClaimsRoutes);
app.use("/api/lost-reports", lostReportsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
