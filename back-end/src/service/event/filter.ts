export interface Filter {
    //since the given json is made of transactions instead of events,
    //a .map() is best applied to the transactions json instead of .filter()
    filterEvents(transactions: any[]): any[];
}

//used to combine 2 filters, BOTH have to be met for an event to pass
export class AndFilter implements Filter {
    private filter: Filter;
    private otherFilter: Filter;

    constructor(filter: Filter, otherFilter: Filter) {
        this.filter = filter;
        this.otherFilter = otherFilter;
    }

    filterEvents(transactions: any[]): any[] {
        const firstFiltered = this.filter.filterEvents(transactions);
        return this.otherFilter.filterEvents(firstFiltered);
    }
}

//used to combine 2 filters, AT LEAST 1 has to be met for an event to pass
export class OrFilter implements Filter {
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
        const secondFiltered = this.otherFilter.filterEvents([...transactions]);

        // Merge the results without duplicates
        const mergedResult = [...firstFiltered, ...secondFiltered.filter(item => !firstFiltered.includes(item))];
        // Restore sortation after merge
        return mergedResult.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    }
}

//used to check if the position of the actor (player) is within the range of an x-y location
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
            const yActor = player.state.game.position.y;
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

//checks for event pairs where they each match their corresponding filter and succeed each other within the before/after limit.
//both events found in each pair will be added to the results (no duplicates will be added)
export class SequenceFilter implements Filter {
    private filter: Filter;
    private otherFilter: Filter;
    private beforeLimit: number;
    private afterLimit: number;

    constructor(filter: Filter, otherFilter: Filter, beforeLimit: number, afterLimit: number ) {
        this.filter = filter;
        this.otherFilter = otherFilter;
        this.beforeLimit = beforeLimit;
        this.afterLimit = afterLimit;
    }

    filterEvents(transactions: any[]): any[] {
        const sequenceFilteredTransactions = [];
        //used to prevent duplicates
        const sequenceNumbersSet: Set<number> = new Set();

        // make a copy to prevent issues with changes
        const transactionsCopy = transactions.map(transaction => ({ ...transaction }));
        const firstFiltered = this.filter.filterEvents(transactionsCopy);
        const secondFiltered = this.otherFilter.filterEvents([...transactions]);
        
        for (const firstTransaction of firstFiltered) {
            if (firstTransaction.events?.length > 0)
            {
                const firstTimestamp = new Date(firstTransaction.occurredAt).getTime();

                for (const secondTransaction of secondFiltered) {
                    if (secondTransaction.events?.length > 0)
                    {
                        const secondTimestamp = new Date(secondTransaction.occurredAt).getTime();
                        const timeDifference = (secondTimestamp - firstTimestamp)/1000;
                        if (this.beforeLimit <= timeDifference  && timeDifference <= this.afterLimit) {
                            if (!sequenceNumbersSet.has(firstTransaction.sequenceNumber)) {
                                sequenceFilteredTransactions.push(firstTransaction);
                                sequenceNumbersSet.add(firstTransaction.sequenceNumber);
                            }

                            if (!sequenceNumbersSet.has(secondTransaction.sequenceNumber)) {
                                sequenceFilteredTransactions.push(secondTransaction);
                                sequenceNumbersSet.add(secondTransaction.sequenceNumber);
                            }
                        }
                    }
                }
            }
        }

        return sequenceFilteredTransactions.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    }
}

//Filter that always passes
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
            transaction.events = transaction.events.filter(event => event.actor?.type == "player");
            return transaction;
        });
    }
}

export class FilterTargetPlayerEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.target?.type == "player");
            return transaction;
        });
    }
}

export class FilterAbilityEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.actor?.type == "ability" || event.target?.type == "ability");
            return transaction;
        });
    }
}

export class FilterItemEvents implements Filter {
    filterEvents(transactions: any[]): any[] {
        return transactions.map(transaction => {
            transaction.events = transaction.events.filter(event => event.actor?.type == "item" || event.target?.type == "item");
            return transaction;
        });
    }
}