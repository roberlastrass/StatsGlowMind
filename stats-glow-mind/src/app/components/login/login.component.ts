import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  hide = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const message = params['message'];
      if (!message) {
        this.translate.get('LOGIN.ERRORS.REQUIRED_LOGIN').subscribe((res: string) => {
          this.toastr.error(res, 'Error:', {
            toastClass: 'notification-container',
          });
        });
      }
    });
  }
  

  // Método que comprueba si el usuario existe e inicia sesión
  onSubmit() {
    this.userService.login(this.formLogin.value)
    .then(response => {
      console.log(response);
      this.loginUser(); // Comprueba si el usuario existe en Firestore
    })
    .catch(error => {
      console.log(error),
      this.translate.get(['LOGIN.ERRORS.USER_NOT_FOUND']).subscribe(translations => {
        this.toastr.error(translations['LOGIN.ERRORS.USER_NOT_FOUND'], 'Error:', {
          toastClass: 'notification-container',
        });
      });
    });
  }

  // Método que comprueba si el usuario existe en la base de datos e inicia sesión
  loginUser(){
    this.userService.loginWithUid()
    .then(userExists => {
      if (userExists) {
        console.log('Usuario existe en la base de datos. Redirigiendo a /main.');
        this.router.navigate(['/main']);
      } else {
        console.log('Usuario no existe en la base de datos. Cerrando sesión.');
        this.translate.get(['LOGIN.ERRORS.USER_NOT_FOUND']).subscribe(translations => {
          this.toastr.error(translations['LOGIN.ERRORS.USER_NOT_FOUND'], 'Error:', {
            toastClass: 'notification-container',
          });
        });
        this.userService.logout();
        this.router.navigate(['/login']);
      }
    })
    .catch(error => {
      console.log(error);
      this.translate.get(['LOGIN.ERRORS.INVALID_CREDENTIALS']).subscribe(translations => {
        this.toastr.error(translations['LOGIN.ERRORS.INVALID_CREDENTIALS'], 'Errror:', {
          toastClass: 'notification-container',
        });
      });
    });
  }

  // Método que inicia sesión con la cuenta de Google
  onClick() {
    this.userService.loginGoogle()
      .then(response => {
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch(error => console.log(error))
  }

  // Muestra y oculta la contraseña
  showPassword(event: Event): void {
    event.preventDefault();
    this.hide = !this.hide;
  }

}
