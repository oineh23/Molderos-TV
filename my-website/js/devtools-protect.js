// DevTools Protection Script

function blockRightClick() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert("🚫 Right-click is disabled.");
  });
}

function blockShortcuts() {
  document.addEventListener('keydown', function (e) {
    const blockedCombos = [
      e.key === "F12",
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())),
      (e.ctrlKey && e.key.toLowerCase() === 'u'),
      (e.ctrlKey && e.key.toLowerCase() === 's'),
      (e.metaKey && e.altKey && e.key.toUpperCase() === 'I'),
    ];
    if (blockedCombos.some(Boolean)) {
      e.preventDefault();
      alert("🚫 Action blocked.");
      return false;
    }
  });
}

function detectConsoleOpen() {
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function () {
      document.documentElement.innerHTML = `
        <body style="background:black; color:red; text-align:center; margin-top:20%;">
          <h1>🚫 DevTools access is not allowed.</h1>
        </body>`;
      throw new Error("DevTools Detected");
    }
  });
  setTimeout(() => {
    console.log('%c', element);
  }, 100);
}

function detectBySize() {
  const threshold = 160;
  return (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  );
}

function startDevToolsWatcher() {
  setInterval(() => {
    try {
      detectConsoleOpen();
      if (detectBySize()) {
        document.documentElement.innerHTML = `
          <body style="background:black; color:red; text-align:center; margin-top:20%;">
            <h1>🚫 Developer tools are open. Page access denied.</h1>
          </body>`;
      }

      // Debugger trap
      if (window.devtoolsOpen || window.__debuggerTrap__) {
        debugger;
      }
    } catch (e) {
      console.clear();
    }
  }, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
  blockRightClick();
  blockShortcuts();
  startDevToolsWatcher();
});
