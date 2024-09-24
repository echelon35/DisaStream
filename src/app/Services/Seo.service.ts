import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta, private title:Title) { }

  generateTags(title = "",description = "",picturePath = ""){

    //Default values
    const config = {
      title: (title != "") ? title : "SatellEarth - Réseau social géocentré",
      description: (description != "") ? description : "Le premier réseau social où la Terre est votre meilleure amie",
      image: (picturePath != "") ? picturePath : '/assets/background/world_Moment.jpg'
    }

    this.meta.updateTag({name: 'twitter:card', content: 'summary'});
    this.meta.updateTag({name: 'twitter:site', content: '@twitter'});
    this.meta.updateTag({name: 'twitter:title', content: config.title});
    this.meta.updateTag({name: 'twitter:description', content: config.description});
    this.meta.updateTag({name: 'twitter:image', content: config.image});

    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.meta.updateTag({property: 'og:site_name', content: 'satellearth'});
    this.meta.updateTag({property: 'og:title', content: config.title});
    this.meta.updateTag({property: 'og:description', content: config.description});
    this.meta.updateTag({property: 'og:image', content: config.image});
    this.meta.updateTag({property: 'og:url', content: `https://satellearth.com`});

    this.title.setTitle(config.title);
    this.meta.addTags([
      {name: 'description', content: config.description},
      {name: 'keywords', content: config.description},
    ]);

  }

  generateAleaTag(alea:string){
    switch(alea){
      case "seisme":
        this.generateTags("Séismes en direct - Satellearth","Visualisez les séismes sur la surface du globe en temps réél","/assets/background/earthview.png");
        break;
      case 'inondation':
        this.generateTags("Inondations en direct - Satellearth","Visualisez les inondations sur la surface du globe en temps réél","/assets/background/earthview.png");
        break;
      case 'eruption':
        this.generateTags("Eruptions volcaniques en direct - Satellearth","Visualisez les éruptions volcaniques sur la surface du globe en temps réél","/assets/background/earthview.png");
        break;
      case 'bolide':
        this.generateTags("Bolides en direct - Satellearth","Visualisez la chute de météorites sur la surface du globe en temps réél","/assets/background/earthview.png");
        break;
      case 'cyclone':
        this.generateTags("Temmpêtes en direct - Satellearth","Visualisez les tempêtes sur la surface du globe en temps réél","/assets/background/earthview.png");
        break;
      }
  }
}
