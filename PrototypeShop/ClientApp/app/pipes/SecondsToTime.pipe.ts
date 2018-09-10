import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: 'secondsToTime'
})

export class SecondsToTimePipe implements PipeTransform {
    private lead: string = '';
    private trail: string = '';

    transform(seconds: number, lead?: string, trail?: string, onZero?: string): string {
        if (seconds && seconds > 0) {
            if (lead) {
                this.lead = lead;
            }
            if (trail) {
                this.trail = trail;
            }
            let mm = this.applyLeadingZero(Math.floor(seconds / 60));
            let ss = this.applyLeadingZero(seconds % 60);
            return `${this.lead}${mm}:${ss}${this.trail}`;
        } else if (seconds == 0 && onZero) {
            return onZero;
        } else {
            return '';
        }
        
    }

    private applyLeadingZero(number: number): string {
        let num = number.toString();
        if (num.length < 2) {
            num = `0${num}`;
        }
        return num;
    }
}