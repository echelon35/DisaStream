import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Footer } from "./Components/Footer/Footer.component";
import { RouterModule } from "@angular/router";
import { StepperComponent } from "./Components/Stepper/Stepper.component";
import { ToastrComponent } from "./Components/Toastr/Toastr.component";
import { SpinnerComponent } from "./Components/Spinner/Spinner.component";

@NgModule({
  declarations: [
    Footer,
    ToastrComponent,
    StepperComponent,
    SpinnerComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [Footer, StepperComponent, ToastrComponent, SpinnerComponent]
})
export class SharedModule { }
