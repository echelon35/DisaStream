import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';

@Component({
  templateUrl: './ForgotPassword.view.html',
  styleUrls: ['./ForgotPassword.view.css']
})
export class ForgotPasswordView implements OnInit {

  forgotForm!: UntypedFormGroup;
  loading = false;
  submitted = false;
  
  constructor(protected authApiService: AuthentificationApi,
    private formBuilder: UntypedFormBuilder,
    private router: Router) { }

  // convenience getter for easy access to form fields
  get f() { return this.forgotForm.controls; }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void{

    //En cas de formulaire invalide, on va pas plus loin
    if (this.forgotForm.invalid) {
      return;
    }

    // this.disasterApiService.forgotPassword(this.f.mail.value).subscribe(
    //   data => {
    //     this.loading = false;
    //     this.router.navigate(['/']);
    //     this.toastrService.success(`Un mail vient d'être envoyé à l'adresse ${this.f.mail.value}`);
    //   },
    //   err => {
    //     this.loading = false;
    //     this.toastrService.error(err.error.error);
    //   }
    // )
  }

}
