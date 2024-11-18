import { NgModule } from "@angular/core";
import { LoggedSidebar } from "./Components/LoggedSidebar/LoggedSidebar.component";
import { CommonModule } from "@angular/common";
import { Footer } from "./Components/Footer/Footer.component";
import { LoggedHeader } from "./Components/LoggedHeader/LoggedHeader.component";
import { RouterModule } from "@angular/router";
import { StepperComponent } from "./Components/Stepper/Stepper.component";

@NgModule({
  declarations: [
    LoggedSidebar,
    LoggedHeader,
    Footer,
    StepperComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [LoggedSidebar, Footer, LoggedHeader, StepperComponent]
})
export class SharedModule { }
