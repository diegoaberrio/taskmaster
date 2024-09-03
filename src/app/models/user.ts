// src/app/models/user.ts

export interface User {
  id?: number;         // Opcional, identificador único del usuario
  email: string;       // Obligatorio, dirección de correo electrónico del usuario
  name: string;        // Obligatorio, nombre del usuario
  password?: string;   // Opcional, contraseña del usuario (podría no ser necesario mostrarla aquí)
  points?: number;     // Opcional, puntos del usuario
  avatar?: string;     // Opcional, URL del avatar del usuario
  // Otros campos si son necesarios...
}
