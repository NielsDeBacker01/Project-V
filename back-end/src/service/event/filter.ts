export interface Filter {
    //since the given json is made of transactions instead of events,
    //a .map is best applied to the json instead of .filter
    filterEvents(transactions: any[]): any[];
}

export class AndFilter implements Filter {
    private filter: Filter;
    private otherFilter: Filter;

    constructor(filter: Filter, otherFilter: Filter) {
        this.filter = filter;
        this.otherFilter = otherFilter;
    }

    filterEvents(transactions: any[]): any[] {
        // make a copy to prevent issues with changes
        const transactionsCopy = transactions.map(transaction => ({ ...transaction }));
        const firstFiltered = this.filter.filterEvents(transactionsCopy);
        return this.otherFilter.filterEvents(firstFiltered);
    }
}

export class OrFilter implements Filter {
    private filter: Filter;
    private otherFilter: Filter;

    constructor(filter: Filter, otherFilter: Filter) {
        this.filter = filter;
        this.otherFilter = otherFilter;
    }

    filterEvents(transactions: any[]): any[] {
        // make a copy to prevent issues with changes
        const transactionsCopy1 = transactions.map(transaction => ({ ...transaction }));
        const transactionsCopy2 = transactions.map(transaction => ({ ...transaction }));
        const firstFiltered = this.filter.filterEvents(transactionsCopy1);
        const secondFiltered = this.otherFilter.filterEvents(transactionsCopy2);

        // Merge the results without duplicates
        const mergedResult = [...firstFiltered, ...secondFiltered.filter(item => !firstFiltered.includes(item))];
        // Restore sortation after merge
        return mergedResult.sort((a, b) => a.sequenceNumber - b.sequenceNumber);;
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

export class NearFilter implements Filter {
    private xLocation: number;
    private yLocation: number;
    private range: number;

    constructor(xLocation: number, yLocation: number, range: number) {
        this.xLocation = xLocation;
        this.yLocation = yLocation;
        this.range = range;
    }

    checkIfPlayerIsInRange(player: any): boolean{
        if(player.type == "player" )
        {
            const xActor = player.state.game.position.x;
            const yActor = player.actor.state.game.position.y;
            //formule om verschil tussen 2 punten te bereken. True als player binnen range is
            if(Math.sqrt(Math.pow(this.xLocation - xActor, 2) + Math.pow(this.yLocation - yActor, 2)) <= this.range)
            {
                return true;
            }
        }
        return false;
    }
    
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => this.checkIfPlayerIsInRange(event.actor) || this.checkIfPlayerIsInRange(event.target));
            return transaction;
        });
    }
}