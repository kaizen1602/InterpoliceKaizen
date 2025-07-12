// Importamos las librerías principales
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";

// Importamos las rutas de los módulos
import usuarioRoutes from "./src/modules/usuarios/usuario.routes.js";
import ciudadanoRoutes from "./src/modules/ciudadanos/ciudadano.routes.js";
import authRoutes from "./src/modules/auth/auth.routes.js";


const app = express();
app.use(express.json()); // Para leer JSON en las peticiones

app.use(morgan("tiny")); // Para ver logs sencillos en consola
app.use(cors()); // Permitir peticiones de otros orígenes

// Usamos las rutas de los módulos
app.use("/usuarios", usuarioRoutes);
app.use("/ciudadanos", ciudadanoRoutes);
app.use("/auth", authRoutes);

// Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API ON in port: ${PORT}`);
});


