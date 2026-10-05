# Swervle Haxs

Disables run submissions and adds a button to inject a panel with haxs.

A lot of core code is from [Swervle Utils](https://github.com/PhantomOrigin/SwervleUtils), so read their README for more information.

## Features

### Run Offline

- Prevents sending runs to server. **Remeber to disable this extension when you do actual runs.**
    - Doesn't prevent saving the personal best to local storage.
- Shows the leaderboard rank a run would get based on it's time.

### Helping Hecking Hacky Haxs

- Adds pausing and resuming.
- Advance the game a set number of ticks.
- Slow down the game.

#### Tas

- Export states.
- Import states.
- Play imported states.
- Save state and load state.

### Extension compatibility.

The following are info on the compatibility state with other Swervle extensions.

#### Swervle Overlay's Keyboard Overlay

Compatible with Swervle Overlays. Makes the keyboard overlay get the internal actions so it gets tas inputs too.

#### Swervle Utils

Compatible with Swervle Utils (have to load this extension after Swervel Utils).

# tools

## patch-bundle.mjs

From "Swervle Utils" extension. Patches a downloaded `index.js` and `replay.js` with added code to expose and add new properties and methods. Unlike Swervle Utils, there are a few important patches so it is not recommened to use the patched-bundle if any patches fail.

The file can be run through a workflow action or manually with local files.

### Usage

```bash
node tools/patch-bundle.mjs <main.js> <replay-chunk.js> <out-main.js> <out-replay.js>
```

Usually `<out-main.js>` is `patched-bundle.js` and `<out-replay>` is `patched-replay.js`.

## convert-states-file.mjs

Converts a `states.txt` to a `ghost.json` so you can load it as a ghost.

### Usage

```bash
node tools/convert-states-file.mjs <states.txt> <ghost.json> <optional display name>
```

# Downloaded Website

## swervle.com

Downloaded file via [HTTrack Website Copier](https://www.httrack.com/) using the URL "https://swervle.com" with Update Hack and URL Hack from Spider disabled. 

The following files don't get automatically downloaded and have to be manually downloaded:
- RaceLiveryV1.js
- CarModelV1.js
- CarBodyPickerV1.js
- VehicleLiveryDesignV1.js
- CarBodyVariantV1.js
- VehicleLiverySurfaceV1.js
- VehicleRaceLiveryV1.js
- VehicleRaceStorageV1.js

Can be locally runned via vscode's [live server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). Disclaimer: Because it won't be able to access a server, the code will default to a locally generated map. The code has to be changed for it to read a `daily.json`.

### 2026-09-03 Update

File names no longer have actual names and are now hash-hash.js.

## assets beautified

A select few javascript files that are beautified via [beautifier.io](https://beautifier.io/). This is to make it easier to read by human eyes and allows finding code via line number.

The choosen javascripts files depend on if they will be modified or viewed. `index.js` is always among these files because it is the main file.
