import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, getDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { Teams } from '../models/teams.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor( private firestore: Firestore ) { }

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
    const documentId = await this.getDocumentId(userUID);
    if (documentId) {
      const userDocRef = doc(this.firestore, 'Users', documentId);
      try {
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
        return firstDocument.id;
      } else {
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


  /* GESTIÓN DE EQUIPOS DE LA BASE DE DATOS */

  // Método para añadir o actualizar equipos en la base de datos
  addOrUpdateTeams(team: Teams) {
    const equipoRef = doc(this.firestore, 'Teams', team.id.toString());
    return setDoc(equipoRef, team, { merge: true });
  }

  // Método que recoge todos los equipos que se encuentran en la base de datos
  getTeams(): Observable<Teams[]> {
    const teamsCollection = collection(this.firestore, 'Teams');
    return collectionData(teamsCollection) as Observable<Teams[]>;
  }

}
