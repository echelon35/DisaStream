
import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

export class Step {
    stepLabel = '';
    click!: () => void;
    isActive = false;
    iconPath!: string;
    stepId = '';
    passed = false;
}

@Component({
    selector: 'app-stepper',
    templateUrl: './Stepper.component.html',
    styleUrls: ['./Stepper.component.css'],
    standalone: false
})
export class StepperComponent {

    env = environment;
    
    @Input() steps: Step[] = []
    @Input() isClickable = true;

    activeSelect(step: Step){
        if(this.isClickable){
            step.click();
            this.steps.forEach(item => item.isActive = false);
            step.isActive = true;
        }
    }

}