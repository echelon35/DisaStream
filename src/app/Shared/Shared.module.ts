import { NgModule } from "@angular/core";
import { LoggedSidebar } from "./Components/LoggedSidebar/LoggedSidebar.component";
import { NotLoggedHeader } from "./Components/NotLoggedHeader/NotLoggedHeader.component";
import { CommonModule } from "@angular/common";
import { Footer } from "./Components/Footer/Footer.component";
import { LoggedHeader } from "./Components/LoggedHeader/LoggedHeader.component";

@NgModule({
  declarations: [
    LoggedSidebar,
    NotLoggedHeader,
    LoggedHeader,
    Footer
  ],
  imports: [CommonModule],
  exports: [LoggedSidebar, NotLoggedHeader, Footer, LoggedHeader]
})
export class SharedModule { }
