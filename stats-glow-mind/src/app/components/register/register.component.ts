import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  formRegister: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.formRegister = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl()
    });  
  }

  ngOnInit(): void {
  }

  // Método para registrar un usuario y redirigir hacia /login
  onSubmit() {
    this.userService.register(this.formRegister.value)
      .then(response => {
        console.log(response);
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

}
