import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  userName: string | null;
  userUID: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private firestore: FirestoreService
  ) { 
    this.userName = null;
    this.userUID = '';
  }

  async ngOnInit(): Promise<void> {
    this.userName = this.userService.getUserName();
    this.userUID = this.userService.getUserUID() || '';
  }

  async checkUserRole(): Promise<void> {
    // Llamar al método que obtiene el ID del documento
    const documentId = await this.firestore.getDocumentId(this.userUID);

    if (documentId) {
      // Llamar al método que devuelve el campo 'rol' a partir del ID del documento
      const userRole = await this.firestore.getUserRoleById(documentId);

      if (userRole === 'admin') {
        // El usuario tiene el rol de admin, puedes permitir el acceso a /admin
        console.log('Usuario con rol de admin');
        // Redirigir al componente /admin
        this.router.navigate(['/admin']);
      } else {
        // El usuario no tiene el rol de admin, puedes manejarlo según tus necesidades
        console.log('Usuario sin permisos de administrador');
      }
    } else {
      // Manejar el caso en que no se pueda obtener el ID del documento
      console.log('No se pudo obtener el ID del documento');
    }
  }

}
