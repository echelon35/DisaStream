
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/Seo.service';

@Component({
  templateUrl: './PageNotFound.view.html',
  styleUrls: ['./PageNotFound.view.css']
})
export class PageNotFoundView implements OnInit {

  constructor(private seoService: SeoService) { 
    this.seoService.generateTags("Oups, page non trouvée !","La page que vous cherchez n'est plus sur Disastream","/assets/background/404.jpg");
  }

  ngOnInit(): void {
  }

}
