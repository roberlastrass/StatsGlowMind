import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  language = 'es';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language);
  }

  ngOnInit(): void {}

  // Método para cambiar el idioma
  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.language = lang;
  }
}
