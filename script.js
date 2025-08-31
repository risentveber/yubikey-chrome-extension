async function loadConfig() {
  const response = await fetch(chrome.runtime.getURL("configs.json"), {
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error(`load config: ${response.status}`);
  }

  return await response.json();
}

var alreadyInProgress = false;

function substituteTotp() {
  loadConfig()
    .then((configs) => {
      const hostname = window.location.hostname;
      const config = configs.find((config) => config.hostname === hostname);
      if (!config) {
        return;
      }
      const totpElement = document.querySelector(config.totpElementSelector);
      if (!totpElement) {
        return;
      }
      if (alreadyInProgress) {
        console.log("already in progress, skipping");
        return;
      }
      alreadyInProgress = true;
      const totpId = config.totpId;
      chrome.runtime.sendMessage(chrome.runtime.id, { hostname, totpId });
      return fetch(`http://localhost:9999/get_code?totpId=${totpId}`)
        .then((r) => {
          if (r.status === 408) {
            throw new Error("yubikey: touch account timed out!");
          }
          if (!r.ok) {
            throw new Error("Ошибка HTTP: " + r.status);
          }
          return r.json();
        })
        .then((data) => {
          totpElement.value = data.code;
          if (config.submitFormSelector) {
            document.querySelector(config.submitFormSelector).submit();
          }
        });
    })
    .catch((e) => alert(`ошибка yubikey-extension: ${e}`))
    .then(() => (alreadyInProgress = false));
}

substituteTotp();
window.navigation.addEventListener("currententrychange", function (e) {
  substituteTotp();
});
