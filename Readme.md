# Yubikey Chrome extension

Extension that substitutes TOTP codes for sites.

Main parts:
* manifest.json - required for any extension Chrome Manifest
* background.js - background worker, that showing pop-ups
* server.js - NodeJS server, that interacts with yubikey
* run.sh - server runner with nohup mode
* script.js - extension logic site injector
* icons - icons for extension and pop-ups
* config.json - configuration file

Configuration:
```json
[
  {
    "hostname": "github.com", // domain name 
    "totpId": "github/risentveber", // TOTP account id
    "totpElementSelector": "#app_totp", // TOTP input selector
    "submitFormSelector": ".authentication form" // TOTP form for submission (optional)
  }
]
```
