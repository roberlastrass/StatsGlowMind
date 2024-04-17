import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, signInWithPopup, GoogleAuthProvider, UserCredential } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    private auth: Auth,
    private firestore: FirestoreService
    ) { }

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

  // Método para iniciar sesión de un usuario si su UID existe en la base de datos
  async loginWithUid() {
    const uid = this.auth.currentUser?.uid;
    try {
      if (uid) {
        const documentId = await this.firestore.getDocumentId(uid);
        console.log(documentId);
        if (documentId) {
          // Existe la id del documento del usuario en Firestore, devuelve true
          console.log(`Inicio de sesión exitoso para el usuario con UID: ${uid}`);
          return true;
        } else {
          // NO existe la id del documento del usuario en Firestore, devuelve false
          console.log(`El usuario con UID: ${uid} no existe en la base de datos.`);
          this.logout()
          return false;
        }
      } else {
        console.log('UID es undefined. No se puede continuar con el inicio de sesión.');
        return false;
      }
    } catch (error) {
      console.error('Error al iniciar sesión con UID:', error);
      throw error;
    }
  }

  // Método iniciar sesión de un usuario con Google
  loginGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // Método cerrar sesión de un usuario
  async logout() {
    return await signOut(this.auth);
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
    const userName = this.auth.currentUser;
    return userName ? (userName.displayName || "Usuario Invitado") : "Usuario Invitado";
  }

  // Método obtener uid del usuario
  getUserUID() {
    const userUID = this.auth.currentUser?.uid;
    return userUID;
  }

}
