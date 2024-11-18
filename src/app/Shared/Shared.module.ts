import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Footer } from "./Components/Footer/Footer.component";
import { RouterModule } from "@angular/router";
import { StepperComponent } from "./Components/Stepper/Stepper.component";

@NgModule({
  declarations: [
    Footer,
    StepperComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [Footer, StepperComponent]
})
export class SharedModule { }
