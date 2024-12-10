import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';

@Component({
  templateUrl: './ForgotPassword.view.html'
})
export class ForgotPasswordView implements OnInit {

  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  token = '';
  message = '';
  
  constructor(protected authApiService: AuthentificationApi,
  private toastrService: ToastrService,
  private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void{

    //En cas de formulaire invalide, on va pas plus loin
    if (this.forgotForm.invalid) {
      return;
    }

    this.authApiService.forgotPassword(this.forgotForm?.value?.mail).subscribe({
        next: () => {
          this.message = `Un lien de réinitialisation vient de vous être envoyé à l'adresse ${this.forgotForm?.value?.mail}`;
        },
        error: (e) => {
          this.toastrService.error(`Erreur lors de l'envoi du lien de réinitialisation`, e?.error?.message)
        },
    });

  }

}
