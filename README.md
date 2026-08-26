# Swervle Tas

description tba

## rules.json

The redirect to the patched bundle filters for the exact hash, so when the website updates, the extension completely fails. This is intentional, as it means the patched bundle is outdated. If an improper patched bundle is use, the user could **risk getting banned**. MAKE SURE THERE IS NOTHING WRONG WITH PATCHING THE FILES BEFORE UPDATING OR **RISK GETTING BANNED** WHEN A TAS FINISHES.

# tools

## patch-bundle.mjs

From "Swervle Utils" extension. Patches a downloaded `index.js` and `replay.js` with added code to expose and add new properties and methods. Further documentation is in the file.

### Usage

```bash
node tools/patch-bundle.mjs <main.js> <replay-chunk.js> <out-main.js> <out-replay.js>
```

Usually `<out-main.js>` is `patched-bundle.js` and `<out-replay>` is `patched-replay.js`.

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

## assets beautified

A select few javascript files that are beautified via [beautifier.io](https://beautifier.io/). This is to make it easier to read by human eyes and allows finding code via line number.

The choosen javascripts files depend on if they will be modified or viewed. `index.js` is always among these files because it is the main file.
