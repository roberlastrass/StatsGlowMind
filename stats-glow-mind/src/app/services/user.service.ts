import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private auth: Auth) { }

  // Método registrar un usuario
  register({ username, email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Actualizar el nombre de usuario en el perfil del usuario
      return updateProfile(userCredential.user, { displayName: username })
        .then(() => userCredential.user);
    });
  }

  // Método iniciar sesión de un usuario
  login({email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método cerrar sesión de un usuario
  logout() {
    return signOut(this.auth);
  }

  /*
  // Método verificar un email
  checkEmail() {
    const userCurrent = this.auth.currentUser;
    if (userCurrent) {
      return sendEmailVerification(userCurrent);
    } else {
      return Promise.reject(new Error('Usuario no autenticado.'));
    }
  }
  */

  // Método obtener nombre del usuario
  getUserName(): string | null {
    const user = this.auth.currentUser;
    return user ? (user.displayName || 'Usuario invitado') : 'Usuario invitado';
  }

}
