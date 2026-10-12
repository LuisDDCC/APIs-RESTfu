# APIs-RESTfu
 Integrar en la aplicación de Express el desarrollo de las APIs RESTful del proyecto final para los CRUDs de las tablas (Supabase) y colecciones (MongoDB) necesarias. 

## Cómo correr el proyecto

1. Copiar `.env.example` como `.env` en la raíz y llenar los valores (Supabase y MongoDB).
2. Instalar dependencias:
```bash
   npm install          # API v1 (raíz)
   npm run install:v2   # API v2 (src/api/v2)
```
3. Levantar las APIs (cada una en su terminal):
```bash
   npm run dev          # v1 -> http://localhost:3000/api/v1
   npm run dev:v2       # v2 -> http://localhost:3020/api/v2
```

## API v2 – Usuarios (Supabase)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v2/usuarios` | Lista todos los usuarios |
| GET | `/api/v2/usuarios/:id` | Consulta un usuario |
| POST | `/api/v2/usuarios` | Crea usuario (`nombre`, `email`, `password`); el password se guarda como hash con bcrypt |
| PUT | `/api/v2/usuarios/:id` | Actualiza `nombre`, `email` y/o `password` (solo lo que se envía) |
| DELETE | `/api/v2/usuarios/:id` | Elimina un usuario |

Respuestas de error: `400` datos inválidos, `404` no encontrado, `409` email duplicado.
Las pruebas están en `src/api/v2/request/v2.http`.