import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { MatDialog, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  users: User[];

  constructor(
    public dialog: MatDialog,
    private firestore: FirestoreService
  ) {
    this.users = [{
      uid: 'UIDdeUsuario',
      email: 'usuario@email.com',
      displayName: 'Nombre usuario',
      rol: 'user'
    }];
  }

  ngOnInit(): void {
    this.firestore.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  // Método que elimina un usuario de la Firestore
  async onClickDelete(userUID: string) {
    await this.firestore.deleteUserFirestore(userUID);
  }

  // Método que abre un dialogo qpara confirmar la eliminación de un usuario
  openDialog(userName: string, userUID: string): void {
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      data: { userName } // Pasa al dialogo el nombre del usuario
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      if (result === 'confirm') {
        this.onClickDelete(userUID);
      }
    });
  }
}


// Dialog Delete User
@Component({
  selector: 'dialog-delete-user',
  templateUrl: 'dialog-delete-user.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class DialogDeleteUser {
  constructor(public dialogRef: MatDialogRef<DialogDeleteUser>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string }
  ) {}

}

