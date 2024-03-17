import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  users: User[];

  constructor(
    private userService: UserService
  ) {
    this.users = [{
      uid: 'UIDdeUsuario',
      email: 'usuario@email.com',
      displayName: 'Nombre usuario',
      rol: 'user'
    }];
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  async onClickDelete(userUID: string) {
    await this.userService.deleteUserFirestore(userUID);
  }

}
