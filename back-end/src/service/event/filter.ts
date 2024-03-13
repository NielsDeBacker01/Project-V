export interface Filter {
    //since the given json is made of transactions instead of events,
    //a .map is best applied to the json instead of .filter
    filterEvents(transactions: any[]): any[];
}

export class AndFilter implements Filter {
    private filter: Filter;
    private otherFilter: Filter;

    constructor(criteria: Filter, otherCriteria: Filter) {
        this.filter = criteria;
        this.otherFilter = otherCriteria;
    }

    filterEvents(transactions: any[]): any[] {
        const firstFiltered = this.filter.filterEvents(transactions);
        return this.otherFilter.filterEvents(firstFiltered);
    }
}

export class FilterNone implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions;
    }
}

export class FilterKillEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.action == "killed");
            return transaction;
        });
    }
}

export class FilterActorPlayerEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.actor.type == "player");
            return transaction;
        });
    }
}

export class FilterTargetPlayerEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.target.type == "player");
            return transaction;
        });
    }
}

export class FilterAbilityEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.actor.type == "ability" || event.target.type == "ability");
            return transaction;
        });
    }
}

export class FilterItemEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.actor.type == "item" || event.target.type == "item");
            return transaction;
        });
    }
}