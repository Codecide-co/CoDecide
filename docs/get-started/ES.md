# Primeros Pasos

Guía paso a paso para configurar la plataforma **CoDecide** en tu máquina local.

---

## Requisitos

Asegúrate de tener instalado lo siguiente:

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| [Git](https://git-scm.com/) | >= 2.30 | Control de versiones |
| [Python](https://www.python.org/) | >= 3.10 | Entorno del backend |
| [Node.js](https://nodejs.org/) | >= 18 | Entorno del frontend |
| [npm](https://www.npmjs.com/) | >= 9 | Gestor de paquetes del frontend |
| [MongoDB](https://www.mongodb.com/) | >= 6.0 | Almacenamiento de documentos (adjuntos, auditoría) |

> **MongoDB** puede ejecutarse localmente con `mongod` o con [Docker](https://www.docker.com/):
> ```bash
> docker run -d -p 27017:27017 --name codecide-mongo mongo:7
> ```

---

## 1. Clonar el Repositorio

```bash
git clone https://github.com/Codecide-co/CoDecide.git
cd CoDecide
```

---

## 2. Cambiar a la Rama de Desarrollo

Todo el desarrollo activo ocurre en la rama `dev`.

```bash
git checkout dev
git pull origin dev
```

---

## 3. Configuración del Backend

### 3.1 Crear un Entorno Virtual

**Windows (PowerShell):**
```powershell
cd apps\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
cd apps/backend
python3 -m venv venv
source venv/bin/activate
```

### 3.2 Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3.3 Configurar Variables de Entorno

Copia el archivo de ejemplo y ajústalo según sea necesario:

```bash
cp .env.example .env
```

Los valores por defecto en `.env` funcionan para desarrollo local (SQLite, MongoDB en localhost).

### 3.4 Ejecutar Migraciones de Base de Datos

```bash
flask db upgrade
```

Esto crea todas las tablas necesarias en SQLite (o MySQL si está configurado).

### 3.5 Iniciar el Servidor Backend

```bash
python run.py
```

La API estará disponible en `http://localhost:5000`.  
Pruébala con:

```bash
curl http://localhost:5000/api/hello
# Esperado: {"message":"Hello, CoDecide!"}
```

---

## 4. Configuración del Frontend

### 4.1 Instalar Dependencias

```bash
cd apps/frontend
npm install
```

### 4.2 Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## 5. Verificar que Todo Funciona

1. **Frontend** — Abre `http://localhost:5173` en tu navegador
2. **Backend salud** — `curl http://localhost:5000/api/hello`
3. **Registrar un usuario**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Usuario de prueba","email":"test@example.com","password":"123456"}'
   ```
4. **Iniciar sesión y guardar el token**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"123456"}'
   ```

---

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| `pip` no encontrado | Asegúrate de que Python esté en el PATH y el entorno virtual esté activado |
| `flask` no reconocido | Ejecuta `pip install flask` o activa el entorno virtual |
| Conexión a MongoDB rechazada | Inicia MongoDB (`mongod`) o el contenedor de Docker |
| Puerto 5000 en uso | Cambia el puerto en `apps/backend/.env` o detén el proceso |
| Puerto 5173 en uso | Vite sugerirá automáticamente el siguiente puerto disponible |
| Errores de base de datos después de actualizar | Ejecuta `flask db upgrade` para aplicar nuevas migraciones |

---

## Próximos Pasos

- Lee la [documentación de arquitectura del backend](../backend/ES/) para entender la API
- Lee la [documentación de arquitectura del frontend](../../docs/frontend/ES/) para entender la estructura SPA
- Revisa [CONTRIBUTING.es.md](../CONTRIBUTING.es.md) para la estrategia de ramas y el flujo de PRs
