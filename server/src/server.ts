import express, { Application } from 'express';
import itemsRoutes from './routes/items';
import usersRoutes from './routes/users';

const app: Application = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
