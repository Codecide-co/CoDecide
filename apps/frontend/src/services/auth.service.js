import { fetchApiData, postApiData } from "../utils/api";

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

    if (!user) {
        throw new Error("Credenciales invalidas");
    }

    if (user.password !== password) {
        throw new Error("Credenciales invalidas");
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    return user;
}