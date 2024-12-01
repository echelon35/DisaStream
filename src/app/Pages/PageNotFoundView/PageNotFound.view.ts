
import { Component } from '@angular/core';
import { SeoService } from 'src/app/Services/Seo.service';

@Component({
  templateUrl: './PageNotFound.view.html',
})
export class PageNotFoundView {

  constructor(private seoService: SeoService) { 
    this.seoService.generateTags("Oups, page non trouvée !","La page que vous cherchez n'est plus sur Disastream","/assets/background/404.jpg");
  }

}
