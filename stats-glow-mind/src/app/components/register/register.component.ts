import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private toastr: ToastrService,
    private firestore: AngularFirestore
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

        const registeredUser = response;

        // Add the user data to Firestore
        this.firestore.collection('users').doc(registeredUser.uid).set({
          email: registeredUser.email,
          usename: registeredUser.displayName,
          rol: this.formRegister.value.rol
        })

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
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch(error => console.log(error))
  }

}
