import express, { Application } from "express";
import itemsRoutes from "./routes/items";
import usersRoutes from "./routes/users";
import dotenv from "dotenv";
import lostReportsRoutes from "./routes/lost_reports";
import ownershipClaimsRoutes from "./routes/ownershipClaims";
import cors from "cors";
import { initializeItems, initializeLostReports, initializeOwnershipClaims, initializeUsers } from "../mock/initializeData"; 

dotenv.config(); // Ładowanie zmiennych z pliku .env

const app: Application = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:3000", // Zezwalaj na dostęp tylko z frontendu
    methods: ["GET", "POST", "PUT", "DELETE"], // Zezwalaj na określone metody HTTP
    credentials: true, // Zezwól na przesyłanie ciasteczek
  })
);
// Middleware
app.use(express.json());

// Routes
app.use("/api/items", itemsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ownership-claims", ownershipClaimsRoutes);
app.use("/api/lost-reports", lostReportsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  (async () => {
    await initializeUsers();
    await initializeItems();
    await initializeLostReports();
    await initializeOwnershipClaims();
  })();
});
