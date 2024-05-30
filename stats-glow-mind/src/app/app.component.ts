import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  showingDescription = false;
  text: string = '';
  activeComponent: string = 'standings';

  constructor(
    private router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  // Método para redirigir a '/register' y ocultar el botón
  redirectToMain() {
    this.router.navigate(['/main']);
  }

  // Método para redirigir a '/login' y ocultar el botón
  redirectToLogin(text: string) {
    this.showingDescription = true;
    this.text = text;
    this.router.navigate(['/login'], { queryParams: { message: 'Acceso Normal' } });
  }

  // Método cerrar sesión usuario y redirige a ''
  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['']);
      })
      .catch(error => console.log(error));
  }

  // Muestra un texto al seleccionar un botón
  showDescription(description: string): void {
    this.showingDescription = true;
    this.text = description;
  }

}
