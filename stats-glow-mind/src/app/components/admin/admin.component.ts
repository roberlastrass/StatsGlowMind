import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { MatDialog, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../services/firestore.service';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  // Método que elimina un usuario de la Firestore
  async onClickUpdate(userUID: string, email: string, displayName: string) {
    await this.firestore.updateUserFirestore(userUID, email, displayName);
  }

  // Método que abre un dialogo qpara confirmar la eliminación de un usuario
  openDialogDelete(userName: string, userUID: string): void {
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      data: { userName }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      if (result === 'confirm') {
        this.onClickDelete(userUID);
      }
    });
  }

  // Método que abre un dialogo qpara confirmar la modificación de un usuario
  openDialogUpdate(user: User): void {
    const dialogRef = this.dialog.open(DialogUpdateUser, {
      data: { ...user }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      if (result.action === 'confirm' && result.data) {
        this.onClickUpdate(user.uid, result.data.email, result.data.displayName);
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

// Dialog Update User
@Component({
  selector: 'dialog-update-user',
  templateUrl: 'dialog-update-user.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, 
            MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
})
export class DialogUpdateUser {
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateUser>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  onSave(): void {
    this.dialogRef.close({ action: 'confirm', data: this.data });
  }
}
