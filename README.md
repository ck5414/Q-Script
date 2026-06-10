# Q-Script

A simple Q-learning helper library for JavaScript.

## Importing

Use the hosted script:

```html
<script src="https://limedev.xyz/lib/ai.js"></script>
```

Or use a local copy:

```html
<script src="./ai.js"></script>
```

## Usage

### Create a Q-table

```js
const name = "myNewAi";
const explorationRate = 0.1; // chance of random action during learning
const discountFactor = 0.9;  // importance of future rewards

const myNewAi = new qTable(name, explorationRate, discountFactor);
```

`name` is used as the key in `localStorage`, so the table persists between reloads.

### Mark terminal states

Use `saveTerminal(state, reward)` for end states:

```js
myNewAi.saveTerminal("win", 1);
myNewAi.saveTerminal("lose", -1);
myNewAi.saveTerminal("draw", 0);
```

### Save transitions and learned values

Use `save(state, action, possibleNextStates, additionalReward = 0, mode = "max")`:

```js
myNewAi.save(
  "player-turn:X..O.....",
  "place-4",
  ["opponent-turn:X..OO....", "opponent-turn:X..O.O..."],
  0,
  "max"
);
```

- `state`: current state key
- `action`: action taken from that state
- `possibleNextStates`: next states reachable after the action
- `additionalReward`: immediate reward added to estimated future reward
- `mode`:
  - `"max"` for agents trying to maximize reward
  - `"min"` for agents trying to minimize score (for adversarial behavior)

### Choose an action

Use `get(state, possibleActions, canExplore = true)`:

```js
const action = myNewAi.get(
  "player-turn:X..O.....",
  ["place-1", "place-2", "place-4", "place-7"],
  true
);
```

- If exploration is enabled, the agent may return a random action based on `explorationRate`.
- If a state has no learned values yet, it picks a random action.
- If multiple actions share the best score, one is picked randomly.

## Notes

- Data is stored in `localStorage`.
- Calling `get()` on a terminal state throws an error.
- This library expects your app to define how states/actions are represented as strings.
