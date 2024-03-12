export interface Criteria {
    meetCriteria(events: any[]): any[];
}

export class CriteriaTemp implements Criteria {
    meetCriteria(events: any[]): any[] {
        return events.filter(event => {
            return event.id != "0"
        });
    }
}
