import { Component } from "@angular/core";

@Component({
    templateUrl: './FreeMode.modal.html',
    selector: "app-free-modal",
    standalone: false
})
export class FreeModeComponent {
  isVisible = false;

  toggleVisible() {
    this.isVisible = !this.isVisible;
  }
}