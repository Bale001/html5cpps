class login {
  start() {
    this.scene = cp.myScene;
    this.remembermeStatus = false;
    this.rememberpassStatus = false;
    const LOADER = cp.getCurrentLoader;
    cp._login = this;
    LOADER.loadFiles(
      "login_form",
      [media + "content/base/login/input.html"],
      this.createPage
    );
    LOADER.loadFiles(
      "sugWorldText",
      [media + "content/base/login/suggested_worlds_text.html"],
      function () {}
    );
    LOADER.loadFiles(
      "serverSelect",
      [media + "content/base/login/server_select.html"],
      function () {}
    );
    LOADER.loadFiles(
      "passwordNote",
      [media + "content/base/login/images/password_note.png"],
      function () {}
    );
  }
  createPage() {
    const LOADER = cp.getCurrentLoader;
    LOADER.destroyAllObjects();
    const main = cp.myScene; /* may not be necessary */
    const CENTERX = cp.game.canvas.width / 2;
    const CENTERY = cp.game.canvas.height / 2;
    const login_form = LOADER.addObject(
      [CENTERX, CENTERY],
      "html"
    ).createFromCache("login_form");
    login_form.width = 430;
    login_form.height = 420;
    cp.getCurrentLogin.rememberpassBox = document.getElementById(
      "rememberpass"
    );
    cp.getCurrentLogin.remembermeBox = document.getElementById("rememberme");
    cp.getCurrentLogin.remembermeBox.onclick = cp.getCurrentLogin.rememberme;
    cp.getCurrentLogin.remembermeBox.src = `${media}content/base/login/images/unchecked.png`;
    cp.getCurrentLogin.rememberpassBox.onclick =
      cp.getCurrentLogin.rememberpass;
    cp.getCurrentLogin.rememberpassBox.src = `${media}content/base/login/images/unchecked.png`;
    cp.getCurrentLogin.loginBtn = document.getElementById("loginBtn");
    cp.getCurrentLogin.loginBtn.addEventListener(
      "mouseover",
      cp.getCurrentLogin.loginHover
    );
    cp.getCurrentLogin.loginBtn.addEventListener(
      "mouseleave",
      cp.getCurrentLogin.loginReset
    );
    cp.getCurrentLogin.loginBtn.onclick = cp.getCurrentLogin.loginClick;
    cp.getCurrentLogin.loginBtn.src = `${media}content/base/login/images/loginbtn.png`;
    var note = LOADER.addObject(
      [CENTERX + 250, CENTERY - 20],
      "image",
      "passwordNote"
    );
    
  }
  createServerSelectPage(worlds) {
    const LOADER = cp.getCurrentLoader;
    LOADER.destroyAllObjects();
    const CENTERX = cp.game.canvas.width / 2;
    const CENTERY = cp.game.canvas.height / 2;
    let world_select_text = LOADER.addObject(
      [CENTERX, CENTERY - 250],
      "html"
    ).createFromCache("sugWorldText");
    let world_select = LOADER.addObject(
      [CENTERX, CENTERY - 30],
      "html"
    ).createFromCache("serverSelect");
    world_select.width = 500;
    world_select.height = 300;
    world_select_text.width = 385;

    //create servers
    document.getElementById(
      "serverSelectContainer"
    ).innerHTML = cp.getCurrentLogin.createServerList(worlds);
  }
  createServerList(servers) {
    let finalXml = "";
    for(var serverNum in servers) {
      let server = servers[serverNum];
      let serverMap = JSON.parse(JSON.stringify(cp.crumbs.serverBaseMap));
      const amntOnline = server.amount;
      //add server amount indicators
      //TODO: add green ones
      for (let i = 0; i < 6; i++) {
        serverMap.div.img.push({
          "@src": `${media}content/base/login/images/server_amount_${
            i > amntOnline ? "un" : ""
          }checked.png`,
          "@class": "serverAmount",
          "@style": `left: ${65 + i * 5}%; top: ${13 + serverNum * 60}px`,
        });
      }
      console.log(server);
      serverMap["div"]["span"]["#text"] = server.name;
      serverMap["div"]["span"]["@style"] = `top: ${11 + serverNum * 60}px`;
      serverMap["div"]["img"][0]["@style"] = `top: ${-3 + serverNum * 60}px`;
      serverMap["div"]["input"]["@id"] = server.id;

      finalXml += json2xml(serverMap, "");
    };

    return finalXml;
  }
  rememberme() {
    const login = cp.getCurrentLogin;
    const CHECKBOX = login.remembermeBox;
    CHECKBOX.setAttribute(
      "src",
      `${media}content/base/login/images/${
        login.remembermeStatus ? "unchecked" : "checkedmark"
      }.png`
    );
    login.remembermeStatus = !login.remembermeStatus;
  }
  rememberpass() {
    const login = cp.getCurrentLogin;
    const CHECKBOX = login.rememberpassBox;
    CHECKBOX.setAttribute(
      "src",
      `${media}content/base/login/images/${
        login.rememberpassStatus ? "unchecked" : "checkedmark"
      }.png`
    );
    login.rememberpassStatus = !login.rememberpassStatus;
  }
  loginHover(event) {
    event.target.setAttribute(
      "src",
      `${media}content/base/login/images/loginbtn_hover.png`
    );
  }
  loginReset(event) {
    event.target.setAttribute(
      "src",
      `${media}content/base/login/images/loginbtn.png`
    );
  }
  loginClick(event) {
    const username = document.getElementById("usernameField").value;
    const password = document.getElementById("passwordField").value;

    cp.getCurrentLoader.startLoaderScreen();
    cp.getCurrentAirtower.createLoginConnection(username, password);
  }
  joinWorld(server) {
    cp.getCurrentLoader.startLoaderScreen();
    cp.getCurrentAirtower.createWorldConnection(server.id);
  }
}
