import { Injectable } from "@angular/core";

export class Picture {
    path: string;
    alt: string;
    author: string;
    authorLink: string;
}

@Injectable({
    providedIn: 'root'
})
export class RandomPictureService {

    picturesVm: Picture[];
    currentPicture: Picture;

    constructor(){
        this.picturesVm = [
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/avalanche.jpg', author: 'Iris Vallejo', authorLink: 'https://pixabay.com/fr/users/witizia-261998', alt: 'Chaînes de montagnes' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/foudre.jpg', author: 'JPlenio', authorLink: 'https://pixabay.com/fr/users/jplenio-7645255/', alt: 'Cumulonimbus' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/fireball.jpg', author: 'Jeff_way', authorLink: 'https://pixabay.com/fr/users/jeff_way-19059328/', alt: 'Ciel étoilé' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/eruption.jpg', author: 'kimura2', authorLink: 'https://pixabay.com/fr/users/kimura2-490872/', alt: 'Mont fuji sur fond de ciel bleu' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/hurricane.jpg', author: 'WikiImages', authorLink: 'https://pixabay.com/fr/users/wikiimages-1897/', alt: 'Cyclone' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/landslide.jpg', author: 'Saiful Mulia', authorLink: 'https://pixabay.com/fr/users/saifulmulia-122995/', alt: 'Trou dans le sol, doline' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/desert.jpg', author: 'Pexels', authorLink: 'https://pixabay.com/fr/users/pexels-2286921/', alt: 'Désert de sable' },
            { path: 'https://disastream.s3.eu-west-3.amazonaws.com/background/wind.jpg', author: 'Daniel Brachlow', authorLink: 'https://pixabay.com/fr/users/danielbrachlow-2171695/', alt: 'Moulin à vent' },
        ]
    }

    getPictureRandom(): Picture{
        const randomNb = Math.floor(Math.random() * this.picturesVm.length);
        return this.picturesVm[randomNb];
    }
}