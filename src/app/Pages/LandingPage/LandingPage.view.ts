import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FreeModeComponent } from 'src/app/Modals/FreeMode/FreeMode.modal';
import { ProPacksComponent } from 'src/app/Modals/ProPacks/ProPacks.modal';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { UserApiService } from 'src/app/Services/UserApiService';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';

@Component({
  templateUrl: './LandingPage.view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';
  isAuth = false;
  isSidebarOpen = false;

  //Change detector to update component manually
  private cd = inject(ChangeDetectorRef)

  faqs = [
    {
      question: "A qui s'adresse Disastream ?",
      answer: `Tout particulier ou professionnels désireux d'être alerté rapidement en cas de catastrophe naturelle ou environnementale. 
      Des offres adaptées existent pour chaque profil.`,
      open: false,
    },
    {
      question: "En quoi Disastream peut-il aider mon business ?",
      answer: `Certains métiers nécessitent par nature une information rapide et fiable. En ce sens, Disastream peut vous aider en vous
      fournissant une information de qualité en un temps record.
      <br>
      <ul class="list-disc">
        <li><b>Vous étiez déjà abonné à des sources utilisées par Disastream ?</b> Disastream centralise tout, plus besoin de jongler entres les onglets.</li>
        <li><b>Vous avez besoin de surveiller des lieux particuliers ?</b> Importez votre liste, on s'occupe du reste.</li>
        <li><b>Vous manquiez d'outils pour visualiser les données ?</b> Disastream vous les mets à disposition.</li>
      </ul>`,
      open: false,
    },
    {
      question: "Quels sont les évènements surveillés par Disastream ?",
      answer: `A l'heure actuelle, Disastream surveille quatre typologies d'évènements :
      <ul>
        <li>Cyclones & typhons</li>
        <li>Eruptions volcaniques</li>
        <li>Inondations</li>
        <li>Séismes</li>
      </ul>
      Beaucoup d'autres sont déjà prévues, n'hésitez pas à vous abonner à la newsletter pour en savoir plus !
      `,
      open: false,
    },
    {
      question: "Pourquoi un évènement est survenu sans que Disastream sans aperçoive ?",
      answer: `En effet, il peut arriver que certains évènements ne soient pas detectés par Disastream, et ce pour plusieurs raisons :
      <ul>
        <li>La source liée à ce type d'évènements n'est pas encore intégrée</li>
        <li>Nos sources ne surveillent pas cette partie du globe</li>
        <li>L'évènement est trop localisé</li>
      </ul>`,
      open: false,
    },
    {
      question: "Pourquoi je reçois certains évènements longtemps après ?",
      answer: `Certaines sources nous alertent parfois d'un évènement longtemps après sa survenue. Cela s'explique car la saisie au sein de la source peut 
      parfois être réalisée par des humains et prendre du temps à la vérification. Toutefois, les utilisateurs sont majoritairement avertis dans les minutes voire les
      heures qui suivent un évènement.`,
      open: false,
    },
    {
      question: "Les sources utilisées sont-elles fiables ?",
      answer: `Les sources de Disastream sont des observatoires scientifiques internationaux. Certains d'entres-eux sont des systèmes d'alertes automatisés
      qui génèrent automatiquement un évènement lorsque les instruments de mesure le détectent.`,
      open: false,
    },
    {
      question: "Pourquoi Disastream est encore gratuit ?",
      answer: `En effet, pour le moment Disastream est encore disponible dans sa version gratuite. Vous serez averti lorsque les options payantes seront mise
      en place, vous pourrez alors choisir le plan quoi vous convient le mieux.`,
      open: false,
    },
  ];

  isFeaturePictureVisible = false;
  @ViewChild("featurePicture") featurePicture: ElementRef;
  @ViewChild("free") freeModal: FreeModeComponent;
  @ViewChild("pro") proPackModal: ProPacksComponent;

  constructor(private route: ActivatedRoute,
    public router: Router, 
    private authenticationApi: AuthentificationApi, 
    private userApiService: UserApiService,
    private toastrService: ToastrService){
    const token = this.route.snapshot.queryParamMap.get('access_token');
    const mail = this.route.snapshot.queryParamMap.get('mail');
    this.isAuth = this.authenticationApi.isAuthenticated();
    if(token){
      this.authenticationApi.saveToken(token);
      this.userApiService.getSummaryInfos().subscribe((a) => {
        authenticationApi.saveSummary(a.avatar,a.firstname, a.lastname, a.username);
        this.router.navigate(['/dashboard/alerts/manage']).then(() => {
          window.location.reload();
        });
      })
    }
    else if(mail){
      this.toastrService.success(`Inscription réalisée avec succès.`,`Un mail de confirmation vient de vous être envoyé à <b>${mail}</b>.`);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
    const y = this.featurePicture?.nativeElement?.getBoundingClientRect()?.y;
    this.isFeaturePictureVisible = y < 550;
  }

  subscribe(){
    this.freeModal?.toggleVisible();
    this.updateComponent();
  }

  subscribePro(){
    this.proPackModal?.open();
    this.updateComponent();
  }

  /**
   * Update view
   */
    updateComponent(){
      this.cd.markForCheck();
    }
}