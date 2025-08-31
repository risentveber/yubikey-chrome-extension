chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Touch yubikey",
    message: `to get your code for ${request.hostname} with ${request.totpId}`,
  });
  sendResponse({});
  return true;
});
