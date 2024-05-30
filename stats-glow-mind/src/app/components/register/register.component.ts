import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { FirestoreService } from '../../services/firestore.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  formRegister: FormGroup;
  hide = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private firestore: FirestoreService,
    private translate: TranslateService
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

  // Método para registrar un usuario
  onSubmit() {
    const password = this.formRegister.value.password;
    const repeatPassword = this.formRegister.value.repeatPassword;

    if (password != repeatPassword) {
      this.translate.get(['REGISTER.ERRORS.PASSWORDS']).subscribe(translations => {
        this.toastr.error(translations['REGISTER.ERRORS.PASSWORDS'], 'Error:', {
          toastClass: 'notification-container',
        });
      });
      this.router.navigate(['/register']);
      return;
    }
    this.userService.register(this.formRegister.value)
      .then(response => {

        this.addDataUser(response);

        console.log(response);
        this.translate.get(['REGISTER.ERRORS.TRUE', 'REGISTER.ERRORS.CORRECT']).subscribe(translations => {
          this.toastr.error(translations['REGISTER.ERRORS.TRUE'], translations['REGISTER.ERRORS.CORRECT'], {
            toastClass: 'notification-container',
          });
        });
        this.router.navigate(['/main']);
      })
      .catch(error => {
        this.translate.get(['REGISTER.ERRORS.INVALID_CREDENTIALS']).subscribe(translations => {
          this.toastr.error(translations['REGISTER.ERRORS.INVALID_CREDENTIALS'], "Error:", {
            toastClass: 'notification-container',
          });
        });
        console.log(error)
      });
  }

  // Método para registrarse con la cuenta de Google 
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
    this.firestore.addUserDatabase(usuario);
  }

  // Muestra y oculta la contraseña
  showPassword(event: Event): void {
    event.preventDefault();
    this.hide = !this.hide;
  }

}
