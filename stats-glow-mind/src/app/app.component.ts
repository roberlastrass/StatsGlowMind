import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  showingDescription = false;
  text: string = '';
  activeComponent: string = 'standings';

  /*allLinks: string[] = [
    "Celtics", "Nets", "Knicks", "76ers", "Raptors",
    "Bulls", "Cavaliers", "Pistons", "Pacers", "Bucks",
    "Hawks", "Hornets", "Heat", "Magic", "Wizards",
    "Nuggets", "Timberwolves", "Thunder", "Blazers", "Jazz",
    "Warriors", "Clippers", "Lakers", "Suns", "Kings",
    "Mavericks", "Rockets", "Grizzlies", "Pelicans", "Spurs"
  ];
  getTeamLink(teamName: string): string {
    return "/teams/" + teamName;
  }*/

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    //this.addBeforeUnloadListener();
  }

  // Método para redirigir a '/register' y ocultar el botón
  redirectToMain() {
    this.router.navigate(['/main']);
  }

  // Método para redirigir a '/login' y ocultar el botón
  redirectToLogin(text: string) {
    this.showingDescription = true;
    this.text = text;
    this.router.navigate(['/login']);
  }

  // Método cerrar sesión usuario y redirige a ''
  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['']);
      })
      .catch(error => console.log(error));
  }

  /*
  // Cerrar sesión automáticamente en caso de que la app se cierre
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: Event): void {
    // Realiza acciones antes de que la página se cierre (por ejemplo, cierra sesión)
    this.userService.logout().catch(error => console.log(error));
  }
  private addBeforeUnloadListener(): void {
    window.addEventListener('beforeunload', this.beforeunloadHandler.bind(this));
  }*/

  // Muestra un texto al seleccionar un botón
  showDescription(description: string): void {
    this.showingDescription = true;
    this.text = description;
  }

}
