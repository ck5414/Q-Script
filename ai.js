class qTable {
    constructor(name = 'qTable', explorationRate = 0.1, discountFactor = 0.9) {
        this.table = {};
        this.explorationRate = explorationRate;
        this.discountFactor = discountFactor;
        this.name = name;
        if(localStorage.getItem(this.name)) {
            this.table = JSON.parse(localStorage.getItem(this.name));
        } else {
            localStorage.setItem(this.name, JSON.stringify(this.table));
        }
    }

    saveTerminal(terminalState, reward){
        this.table[terminalState] = this.table[terminalState] || {};
        this.table[terminalState]["isTerminal"] = true;
        this.table[terminalState]["value"] = reward;
        localStorage.setItem(this.name, JSON.stringify(this.table))
    }

    save(state, action, possibleNextStates, additionalReward = 0, mode = "max") {
        this.table[state] = this.table[state] || {};
        this.table[state]["isTerminal"] = false;

        if (mode !== "min" && mode !== "max") {
            throw new Error("Invalid mode for qTable.save: " + mode + ". Must be 'min' or 'max'.");
        }
        let reward;
        if (mode === "min") {
            reward = Infinity;
        } else {
            reward = -Infinity;
        }
        if(possibleNextStates.length === 0) {
            reward = 0;
        }
        possibleNextStates.forEach(nextState => {
            if (!this.table[nextState]) {
                if (mode === "min") {
                    reward = Math.min(reward, 0);
                } else {
                    reward = Math.max(reward, 0);
                }
                return;
            }

            if (this.table[nextState]["isTerminal"] === true) {
                if (mode === "min") {
                    reward = Math.min(reward, this.discountFactor * (this.table[nextState]["value"] || 0));
                } else {
                    reward = Math.max(reward, this.discountFactor * (this.table[nextState]["value"] || 0));
                }
                return;
            }

            Object.keys(this.table[nextState]).forEach(key => {
                if (key !== "isTerminal" && this.table[nextState][key]?.["value"] !== undefined) {
                    if (mode === "min") {
                        reward = Math.min(reward, this.discountFactor * (this.table[nextState][key]["value"] || 0));
                    } else {
                        reward = Math.max(reward, this.discountFactor * (this.table[nextState][key]["value"] || 0));
                    }
                }
            });
        });
        if (mode === "min") {
            if (reward === Infinity) {
                reward = 0;
            }
        } else {
            if (reward === -Infinity) {
                reward = 0;
            }
        }
        
        reward += additionalReward;
        this.table[state][action] = this.table[state][action] || {};
        this.table[state][action]["value"] = reward;
        this.table[state][action]["nxtStates"] = possibleNextStates;
        localStorage.setItem(this.name, JSON.stringify(this.table));
    }

    get(state, possibleActions, canExplore = true) {
        if (this.table[state]?.["isTerminal"] === true) {
            throw new Error("[qTable] State is terminal");
        }

        if (canExplore && Math.random() < this.explorationRate) {
            return possibleActions[Math.floor(Math.random() * possibleActions.length)];
        }

        if (!this.table[state]) {
            return possibleActions[Math.floor(Math.random() * possibleActions.length)];
        }

        let maxReward = -Infinity;
        let bestActions = [];

        possibleActions.forEach(action => {
            const reward = this.table[state][action]?.["value"] || 0;

            if (reward > maxReward) {
                maxReward = reward;
                bestActions = [action];
            } else if (reward === maxReward) {
                bestActions.push(action);
            }
        });

        return bestActions[Math.floor(Math.random() * bestActions.length)];
    }
}

/*
qTable = {
    "state":{
        "isTerminal":false,
        "action":{
            "nxtStates":[],
            "value":1,
        },
    },
    "state2":{
        "isTerminal":true,
        "value":1,
    },
};
*/