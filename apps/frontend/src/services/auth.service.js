import { fetchApiData, postApiData } from "../utils/api";

// Error tipado, para distinguir "credeciales invalidas (401)" 
export class AuthError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}

/**
 * Genera un token temporal mientras no exista un backend real de auth
 * que emita JWT. NO es un JWT válido/firmado — es un stand-in para que
 * el resto del frontend (guards de ruta, header Authorization, etc.)
 * pueda desarrollarse ya contra un contrato de "token" real.
 * TODO: reemplazar por el JWT que devuelva POST /api/auth/login cuando
 * el equipo de backend lo tenga listo.
 */
function generateMockToken(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 8, // 8 horas
    };
    return `mock.${btoa(JSON.stringify(payload))}.token`;
}

// Buscar un usuario por su email, si no, entrega un undefine
async function getUserByEmail(email) {
    const users = await fetchApiData(`/users?email=${email}`);
    return users[0];
}

// Registrar 
export async function register(user) {

    const existingUser = await getUserByEmail(user.email);

    if (existingUser) {
        throw new Error("El correo ya existe");
    }

    const newUser = await postApiData("/users", user);

    return newUser;
}

// Login
export async function login(email, password) {

    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
        throw new Error("Credenciales invalidas", 401);
    }

    const token = generateMockToken(user);

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("token", token)

    return { user, token };
}