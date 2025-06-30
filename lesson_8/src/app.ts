import express from 'express';
import projectRoutes from './routes/projectRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/projects', projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
