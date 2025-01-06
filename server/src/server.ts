import express, { Application } from "express";
import itemsRoutes from "./routes/items";
import usersRoutes from "./routes/users";
import dotenv from "dotenv";
import lostReportsRoutes from "./routes/lost_reports";
import ownershipClaimsRoutes from "./routes/ownershipClaims";
import cors from "cors";
import { initializeItems, initializeLostReports, initializeOwnershipClaims, initializeUsers } from "../mock/initializeData"; 

dotenv.config(); 

const app: Application = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);

app.use(express.json());

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
