import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { app } from './conection.js';

const auth = getAuth(app);

// Registrar nuevos usuarios
export const singUp = createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });

// Iniciar sesión
export const login = signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });

// Cerrar sesión
export const singOut = signOut(auth).then(() => {
    // Sign-out successful.
}).catch((error) => {
    // An error happened.
});