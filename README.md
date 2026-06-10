# Q-Script
A simple AI Q-Lerarning library for JavaSript

# Importing
Use
```
<script src='https://limedev.xyz/ai.js'></script>
```
If you want to use the local version just use:
```
<script src='path to file'></script>
```
# Ussage
defining new qTable instance:
```
name = "myNewAi"
//name for the qTable instance this name is used as a key for local storage
explorationRate = 0.1
//chance of ai taking random action when learning
discountFactor = 0.9
//multiplayer for score of previous action that is before scoring state higher for longer games for eg. ches would work with 0.99
const ai = new qTable(name, explorationRate, discountFactor)
```
saving:
terminal state:
```

```
