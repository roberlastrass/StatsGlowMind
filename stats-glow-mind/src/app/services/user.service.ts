import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, signInWithPopup, GoogleAuthProvider, UserCredential } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
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
        const documentId = await this.getDocumentId(uid);
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

  
  /* GESTIÓN DE USUARIOS DE LA BASE DE DATOS */

  // Metodo para añadir a usuarios en la base de datos
  addUserDatabase(user: User) {
    const usuario = collection(this.firestore, 'Users');
    return addDoc(usuario, user);
  }

  // Método para regoger los datos de los usuarios de la base de datos
  getUsers(): Observable<User[]> {
    const userRef = collection(this.firestore, 'Users');
    return collectionData(userRef, { idField: 'id' }) as Observable<User[]>;
  }

  // Método para eliminar el documento de un usuario de la base de datos
  async deleteUserFirestore(userUID: string) {
    // Obtener la referencia del documento usando la UID
    const documentId = await this.getDocumentId(userUID);
    if (documentId) {
      // Construir la referencia del documento
      const userDocRef = doc(this.firestore, 'Users', documentId);
      try {
        // Eliminar el documento
        await deleteDoc(userDocRef);
        console.log('Usuario eliminado con éxito.');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    } else {
      console.log('No se pudo obtener la ID del documento.');
    }
  }

  // Consulta la Id del documento del usuario con UID: uid
  async getDocumentId(uid: string): Promise<string | null> {
    
    const userUID = collection(this.firestore, 'Users');
    const userQuery = query(userUID, where('uid', '==', uid));

    try {
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.size > 0) {
        const firstDocument = querySnapshot.docs[0];
        // Devuelve el ID del documento
        return firstDocument.id;
      } else {
        // No se encontraron documentos que coincidan con la consulta
        return null;
      }
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      return null;
    }
  }

  // Método que a partir de la Id de un documento de User, devuelve el rol
  async getUserRoleById(documentId: string): Promise<string | null> {
    const userDocRef = doc(this.firestore, 'Users', documentId);

    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData ? userData['rol'] : null;
      } else {
        console.log('El documento no existe');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      return null;
    }
  }

}
