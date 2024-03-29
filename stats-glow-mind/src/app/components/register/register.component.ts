import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  formRegister: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.formRegister = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      repeatPassword: new FormControl(),
      rol: new FormControl('user')
    });  
  }

  ngOnInit(): void {
  }

  // Método para registrar un usuario y redirigir hacia /login
  onSubmit() {
    const password = this.formRegister.value.password;
    const repeatPassword = this.formRegister.value.repeatPassword;

    if (password != repeatPassword) {
      this.toastr.error('Las contraseñas ingresadas deben ser las mismas.', 'Error:', {
        toastClass: 'notification-container',
      });
      this.router.navigate(['/register']);
      return;
    }
    this.userService.register(this.formRegister.value)
      .then(response => {

        this.addDataUser(response);

        console.log(response);
        this.toastr.success('Usuario registrado exitosamente.', 'Éxito:', {
          toastClass: 'notification-container',
        });
        this.router.navigate(['/login']);
      })
      .catch(error => {
        this.toastr.success('Alguno de los datos no cumple las condiciones de registro.', 'Error:', {
          toastClass: 'notification-container',
        });
        console.log(error)
      });
  }

  onClick() {
    this.userService.loginGoogle()
      .then(response => {
        const responsiveUser = response.user;
        this.addDataUser(responsiveUser);
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch(error => console.log(error))
  }

  // Metodo insertar datos de usuario
  addDataUser(response: { uid: any; email: any; displayName: any; }){
    const usuario: User = {
      uid: response.uid,
      email: response.email,
      displayName: response.displayName,
      rol: this.formRegister.value.rol
    };
    // Llama al nuevo método del servicio para agregar datos a la base de datos
    this.userService.addUserDatabase(usuario);
  }

}
