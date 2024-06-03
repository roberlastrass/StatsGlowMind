import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  userName: string | null;
  userUID: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private firestore: FirestoreService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { 
    this.userName = null;
    this.userUID = '';
  }

  async ngOnInit(): Promise<void> {
    this.userName = this.userService.getUserName();
    if(this.userName == "Usuario Invitado"){
      this.translate.get('MAIN.USER').subscribe((res: string) => {this.userName = res;});
    }
    this.userUID = this.userService.getUserUID() || ''; 
  }

  async checkUserRole(): Promise<void> {
    const documentId = await this.firestore.getDocumentId(this.userUID);

    if (documentId) {
      const userRole = await this.firestore.getUserRoleById(documentId);
      if (userRole === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.translate.get(['MAIN.ERRORS.NO_ADMIN']).subscribe(translations => {
          this.toastr.error(translations['MAIN.ERRORS.NO_ADMIN'], 'Error', {
            toastClass: 'notification-container',
          });
        });
      }
    } else {
      this.translate.get(['MAIN.ERRORS.NO_ID']).subscribe(translations => {
        this.toastr.error(translations['MAIN.ERRORS.NO_ID'], 'Error', {
          toastClass: 'notification-container',
        });
      });
    }
  }

}
