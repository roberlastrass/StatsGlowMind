import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  userName: string | null;

  constructor(
    private userService: UserService
  ) { 
    this.userName = null;
  }

  ngOnInit(): void {
    this.userName = this.userService.getUserName();
  }

}
