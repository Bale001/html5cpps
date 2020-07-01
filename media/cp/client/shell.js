class shell {
  start() {
    cp._shell = this;
    this.errText = null;
    this.errId = null;
    this.errBtnCallback = null;
    this.LOADER = cp.getCurrentLoader;
    this.LOADER.loadFiles(
      "error_prompt",
      [`${media}content/base/shell/error_prompt.html`],
      () => {}
    );
  }

  showError(text, errId, btnCallback) {
    this.errText = text;
    this.errId = errId;
    this.errBtnCallback = btnCallback;
    const CENTERX = cp.game.canvas.width / 2;
    const CENTERY = cp.game.canvas.height / 2;
    this.prompt = this.LOADER.addObject([CENTERX, CENTERY], "html");
    this.prompt.createFromCache("error_prompt");
    this.prompt.width = 374;
    this.prompt.height = 210;
    document.getElementById("errPrompt").onload = this.loadError;
  }
  centerError(height, width) {
    //I actually have no idea why this works lol
    this.prompt.x = cp.game.canvas.width / 2 - width / 2;
    this.prompt.y = cp.game.canvas.height / 2 - height / 2;
  }
  loadError() {
    document.getElementById("errText").innerHTML = cp.getCurrentShell.errText;
    document.getElementById("errBtn").onclick =
      cp.getCurrentShell.errBtnCallback;
    document.getElementById("errId").innerHTML = cp.getCurrentShell.errId;
    cp.getCurrentShell.errorOverflowFix();
  }
  errorOverflowFix() {
    //calculate how much the error message needs to grow to fit text
    const errPrompt = document.getElementById("errPrompt");
    const errText = document.getElementById("errText");
    const errOffsetY = errText.clientHeight - 54;
    if (errOffsetY > 0) {
      errPrompt.style.height = errPrompt.clientHeight + errOffsetY * 1.2 + "px";
      errPrompt.style.width = errPrompt.clientWidth + errOffsetY / 2 + "px";
    }
    cp.getCurrentShell.centerError(errOffsetY * 1.2, errOffsetY / 2);
  }
}
