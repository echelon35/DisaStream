import { NgModule } from "@angular/core";
import { LoggedSidebar } from "./Components/LoggedSidebar/LoggedSidebar.component";
import { NotLoggedHeader } from "./Components/NotLoggedHeader/NotLoggedHeader.component";
import { CommonModule } from "@angular/common";
import { Footer } from "./Components/Footer/Footer.component";

@NgModule({
  declarations: [
    LoggedSidebar,
    NotLoggedHeader,
    Footer
  ],
  imports: [CommonModule],
  exports: [LoggedSidebar, NotLoggedHeader, Footer]
})
export class SharedModule { }
