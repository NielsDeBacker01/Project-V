export interface Filter {
    //since the given json is made of transactions instead of events,
    //a .map is best applied to the json instead of .filter
    filterEvents(transactions: any[]): any[];
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

export class FilterPlayerEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.actor.type == "player" || event.target.type == "player");
            return transaction;
        });
    }
}
