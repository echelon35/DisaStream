import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';

bootstrapApplication(App, {
  providers: [provideCharts(withDefaultRegisterables())],
}).catch((err) => console.error(err));