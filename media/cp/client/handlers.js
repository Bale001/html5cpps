class handlers {
  start() {
    cp.handlers = this;
    this.errorList = {
      "100": "Penguin not found.<br> Try again?",
      "101": "Incorrect password.<br>NOTE: Passwords are CaSe SeNsiTIVE",
      "603": "<b>Banned:</b><br>You are banned forever",
    };
  }
  handleXML(data) {
    const xml = JSON.parse(xml2json(cp.getCurrentAirtower.parseXml(data), ""));
    const action = xml["msg"]["body"]["@action"];
    try {
      cp.getCurrentAirtower.XmlListeners[action](xml["msg"]["body"]);
    } catch (err) {
      console.log(err);
      console.log(
        "No working handler for " + xml["msg"]["body"]["@action"] + " found"
      );
    }
  }
  handleData(data) {
    const ind = data.split("%");
    if (ind[1] == "xt") {
      try {
        cp.getCurrentAirtower.Listeners[ind[2]].apply(
          null,
          ind.slice(3, ind.length - 1)
        );
      } catch (err) {
        console.log(err);
        console.log("No working handler for " + ind[2] + " found");
      }
    } else {
      console.log("recieved a weird packet");
    }
  }
  errorHandler(id, errno) {
    console.log("Recieved error ", errno);
    cp._shell.showError(cp.handlers.errorList[errno], errno, function () {
      window.location.reload();
    });
  }
  idToWorld(id) {
    return cp.crumbs.worlds[id];
  }
  loginHandler() {
    if (!cp.getCurrentAirtower.world) {
      const SHELL = cp.getCurrentShell;
      console.log(arguments);
      cp.getCurrentAirtower.server.close();
      //GET LOGIN DATA
      const rawLoginData = arguments[1].split("|");
      SHELL.userId = rawLoginData[0];
      SHELL.userSwid = rawLoginData[1];
      SHELL.playerName = rawLoginData[2];
      SHELL.loginKey = rawLoginData[3];
      SHELL.confirmationHash = arguments[2];
      //GET WORLDS
      let worlds = [];
      const rawWorldData = arguments[4].split("|");
      for (let i in rawWorldData) {
        let world = rawWorldData[i].split(",");
        let worldName = cp.handlers.idToWorld(world[0])["name"];
        worlds.push({
          name: worldName,
          amount: parseInt(world[1], 10),
          id: world[0],
        });
      }
      cp.getCurrentLogin.createServerSelectPage(worlds);
    } else {
      cp.getCurrentAirtower.joinServer();
    }
  }
  handleMessage(message) {
    const AIRTOWER = cp.getCurrentAirtower;
    let data = message.data;
    console.log(message.data);
    if (data.startsWith("<")) {
      console.log("got here");
      cp.handlers.handleXML(data);
    } else {
      cp.handlers.handleData(data);
    }
  }
  apiOKHandler() {
    cp.getCurrentAirtower.sendXmlData("rndK");
  }
  apiKOHandler() {}
  rndkHandler(data) {
    cp.getCurrentAirtower.rndk = data["k"];
    cp.getCurrentAirtower.sendLogin();
  }
  joinServerHandler(data) {
    console.log("joined server successfully");
  }
}
