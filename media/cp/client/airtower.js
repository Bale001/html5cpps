class airtower {
  start() {
    cp._airtower = this;
    this.server = null;
    this.rndk = null;
    this.world = false;
    this.parser = new DOMParser();
    this.username = null;
    this.password = null;
    this.extention = "xt";
    this.divider = "%";
    this.xmlData = {
      msg: {
        "@t": "sys",
        body: {
          "@r": "0",
        },
      },
    };
    this.XmlListeners = {};
    this.Listeners = {};
    this.addXmlListener("apiOK", cp.handlers.apiOKHandler);
    this.addXmlListener("apiKO", cp.handlers.apiKOHandler);
    this.addXmlListener("rndK", cp.handlers.rndkHandler);
    this.addListener("l", cp.handlers.loginHandler);
    this.addListener("e", cp.handlers.errorHandler);
    this.addListener("js", cp.handlers.joinServerHandler);
  }
  createLoginConnection(username, password) {
    this.username = username;
    this.password = password;
    this.server = new WebSocket(
      `${cp.crumbs.protocol}://${cp.crumbs.loginServer}:${cp.crumbs.loginPort}`
    );
    this.server.onopen = this.connectionEstablished;
    this.server.onmessage = cp.handlers.handleMessage;
  }
  createWorldConnection(server) {
    this.world = true;
    this.server = new WebSocket(
      `${cp.crumbs.protocol}://${cp.crumbs.worlds[server].ip}:${cp.crumbs.worlds[server].port}`
    );
    this.server.onopen = this.connectionEstablished;
    this.server.onmessage = cp.handlers.handleMessage;
  }
  sendLogin() {
    const SHELL = cp.getCurrentShell;
    if (this.world) {
      const loginUsername = [
        SHELL.userId,
        0,
        this.username,
        SHELL.loginKey,
	0,
        1,
        0,
      ].join("|");
      const passwordHashes = [
        cp.hash.hashLoginKey(SHELL.loginKey, this.rndk),
        SHELL.confirmationHash,
      ].join("#");
      this.sendXmlData("login", [
        [
          "login",
          {
            "@z": "w1",
            nick: { "#cdata": loginUsername },
            pword: { "#cdata": passwordHashes },
          },
        ],
      ]);
    } else {
      this.password = cp.hash.hashPass(this.password, this.rndk);
      this.sendXmlData("login", [
        [
          "login",
          {
            "@z": "w1",
            nick: { "#cdata": this.username },
            pword: { "#cdata": this.password },
          },
        ],
      ]);
    }
  }
  joinServer() {
    const SHELL = cp.getCurrentShell;
    this.sendXt("s", "j#js", [-1, SHELL.userId, SHELL.loginKey, "en"]);
  }
  sendXmlData(action, extra) {
    this.server.send(this.createXMLPacket(action, extra));
  }
  sendXt(attr, action, extra) {
    let packetBase = `${this.divider}${this.extention}${this.divider}`;
    packetBase += attr + this.divider;
    packetBase += action + this.divider;
    // if extra is an array we could
    // extra.reduce((i) => extra[i] + this.divider, packetBase);
    //it looks like extra is an object so i guess this works too
    Object.keys(extra).reduce((i) => extra[i] + this.divider, packetBase);
    console.log(packetBase);
    this.server.send(packetBase);
  }
  addXmlListener(action, callback) {
    this.XmlListeners[action] = callback;
  }
  addListener(action, callback) {
    this.Listeners[action] = callback;
  }
  connectionEstablished() {
    const AIRTOWER = cp.getCurrentAirtower;
    AIRTOWER.sendVerChk("253");
  }
  sendVerChk(version) {
    this.sendXmlData("verChk", [
      [
        "ver",
        {
          "@v": version,
        },
      ],
    ]);
  }
  createXMLPacket(action, extra) {
    const tempXml = JSON.parse(JSON.stringify(this.xmlData));

    tempXml["msg"]["body"]["@action"] = action;
    // should rewrite this but it is one am and i dont care. i'll do this later
    if (extra != undefined) {
      for (var extNum in extra) {
        var node = extra[extNum];
        tempXml["msg"]["body"][node[0]] = node[1];
        console.log(tempXml);
      }
    }
    return json2xml(tempXml, "");
  }
  parseXml(xml) {
    let dom = null;
    if (window.DOMParser) {
      try {
        dom = new DOMParser().parseFromString(xml, "text/xml");
      } catch (e) {
        dom = null;
      }
    } else if (window.ActiveXObject) {
      try {
        dom = new ActiveXObject("Microsoft.XMLDOM");
        dom.async = false;
        if (!dom.loadXML(xml)) {
          // parse error ..

          window.alert(dom.parseError.reason + dom.parseError.srcText);
        }
      } catch (e) {
        dom = null;
      }
    } else {
      alert("cannot parse xml string!");
    }
    return dom;
  }
}
