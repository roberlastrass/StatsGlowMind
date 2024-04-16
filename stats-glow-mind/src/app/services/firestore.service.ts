import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, getDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { Teams } from '../models/teams.model';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { GameStats } from '../models/game-stats.model';

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

  // Método para agregar o actualizar equipos en la base de datos
  addOrUpdateTeams(team: Teams) {
    const equipoRef = doc(this.firestore, 'Teams', team.id.toString());
    return setDoc(equipoRef, team, { merge: true });
  }

  // Método que recoge todos los equipos que se encuentran en la base de datos
  getTeams(): Observable<Teams[]> {
    const teamsCollection = collection(this.firestore, 'Teams');
    return collectionData(teamsCollection) as Observable<Teams[]>;
  }

  // Método que realiza una consulta en la coleccion Teams que a partir del nickname de un equipo, devuelve su id, name y logo
  async getTeamId(teamNickname: string): Promise<any> {
    const teamsRef = collection(this.firestore, 'Teams');
    const queryRef = query(teamsRef, where('nickname', '==', teamNickname));
    try {
      const querySnapshot = await getDocs(queryRef);
      if (!querySnapshot.empty) {
        const teamId = parseInt(querySnapshot.docs[0].id, 10);
        const teamData  = querySnapshot.docs[0].data();
        const teamInfo = {
          id: teamId,
          logo: teamData['logo'],
          name: teamData['name']
        };
        return teamInfo;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      return null;
    }
  }

  // Método para actualizar las medias de estadísticas del equipo en la base de datos
  updateTeamStats(teamId: number, averageStats: any) {
    const teamRef = doc(this.firestore, 'Teams', teamId.toString());
    return setDoc(teamRef, { averageStats }, { merge: true });
  }


  /* GESTIÓN DE PARTIDOS DE LA BASE DE DATOS */

  // Método para agregar o actualizar las estadisticas de un partido en la base de datos
  addOrUpdateGameStats(game: GameStats) {
    const partidoRef = doc(this.firestore, 'Games', game.id.toString());
    return setDoc(partidoRef, game, { merge: true });
  }

  // Método para obtener todas las estadísticas de un equipo en cada partido
  getTeamStatsAllGames(teamId: number): Observable<any[]> {
    const gamesRef = collection(this.firestore, 'Games');
    const teamStats: any[] = [];
    // Consulta para obtener todos los documentos de la colección
    const q = query(gamesRef);

    return new Observable<any[]>(observer => {
      getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const gameData = doc.data() as GameStats;
          let result: string;
          // Verificar si el equipo está en casa
          if (gameData.home.id === teamId) {
            // Comprobar si el equipo local ha ganado
            if (gameData.home.statistics.points > gameData.visitors.statistics.points) {
              result = 'win';
            } else {
              result = 'lose';
            }
            teamStats.push({ ...gameData.home.statistics, result });
          }

          // Verificar si el equipo es visitante
          if (gameData.visitors.id === teamId) {
            // Comprobar si el equipo visitante ha ganado
            if (gameData.visitors.statistics.points > gameData.home.statistics.points) {
              result = 'win';
            } else {
              result = 'lose';
            }
            teamStats.push({ ...gameData.visitors.statistics, result });
          }
        });
        observer.next(teamStats);
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  // Método para obtener las estadísticas de un equipo en partidos jugados en casa y en visitante
  getTeamStatsHomeAndVisitor(teamId: number): Observable<{ teamStatsHome: any[], teamStatsVisitor: any[] }> {
    const gamesRef = collection(this.firestore, 'Games');
    const q = query(gamesRef);

    return new Observable<{ teamStatsHome: any[], teamStatsVisitor: any[] }>(observer => {
      const statsHome: any[] = [];
      const statsVisitor: any[] = [];
      getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const gameData = doc.data() as GameStats;
          if (gameData.home.id === teamId) {
            const result = gameData.home.statistics.points > gameData.visitors.statistics.points ? 'win' : 'lose';
            statsHome.push({ ...gameData.home.statistics, result });
          }
          if (gameData.visitors.id === teamId) {
            const result = gameData.visitors.statistics.points > gameData.home.statistics.points ? 'win' : 'lose';
            statsVisitor.push({ ...gameData.visitors.statistics, result });
          }
        });
        observer.next({ teamStatsHome: statsHome, teamStatsVisitor: statsVisitor });
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  // Método para obtener las estadísticas de un equipo en partidos ganados y en partidos perdidos
  getTeamWinLossStats(teamId: number): Observable<{ teamStatsWin: any[], teamStatsLoss: any[] }> {
    const gamesRef = collection(this.firestore, 'Games');
    const q = query(gamesRef);
  
    return new Observable<{ teamStatsWin: any[], teamStatsLoss: any[] }>(observer => {
      const statsWin: any[] = [];
      const statsLoss: any[] = [];
      getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const gameData = doc.data() as GameStats;
          if (gameData.home.id === teamId) {
            const result = gameData.home.statistics.points > gameData.visitors.statistics.points ? 'win' : 'lose';
            if (result === 'win') {
              statsWin.push({ ...gameData.home.statistics, result });
            } else {
              statsLoss.push({ ...gameData.home.statistics, result });
            }
          }
          if (gameData.visitors.id === teamId) {
            const result = gameData.visitors.statistics.points > gameData.home.statistics.points ? 'win' : 'lose';
            if (result === 'win') {
              statsWin.push({ ...gameData.visitors.statistics, result });
            } else {
              statsLoss.push({ ...gameData.visitors.statistics, result });
            }
          }
        });
        observer.next({ teamStatsWin: statsWin, teamStatsLoss: statsLoss });
      }).catch(error => {
        observer.error(error);
      });
    });
  }

}
