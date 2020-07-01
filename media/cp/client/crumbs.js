class crumbs {
  start() {
    this.loginServer = "100.115.92.199";
    this.protocol = "ws";
    this.loginPort = "6112";
    this.magic = "Y(02.>'H}t\":E1";
    this.worlds = {
      "3100": {
        name: "Wind",
        ip: "100.115.92.199",
        port: "9875",
      },
      "101": {
        name: "Blizzard",
        ip: "100.115.92.199",
        port: "9876",
      },
    };
    this.serverBaseMap = {
      div: {
        "@class": "serverSelectContainer",
        input: {
          "@src":
            `${media}content/base/login/images/server_background.png`,
          "@onmouseover":
            `this.setAttribute('src', '${media}content/base/login/images/server_background_down.png')`,
          "@onmouseleave":
            `this.setAttribute('src', '${media}content/base/login/images/server_background.png')`,
          "@onclick": "cp.getCurrentLogin.joinWorld(this)",
          "@class": "serverSelectContainer",
          "@type": "image",
        },
        img: [
          {
            "@src":
              `${media}content/base/login/images/server_icon.png`,
            "@class": "serverIcon",
          },
        ],
        span: {
          "@class": "serverText",
          "#text": "",
        },
      },
    };
    cp.crumbs = this;
  }
}
