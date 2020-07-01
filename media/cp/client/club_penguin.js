class clubpenguin {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._loader = null;
    this._shell = null;
    this._airtower = null;
    this._engine = null;
    this._login = null;
    this._crumbs = null;
    this.myScene = null;
    this.dependencies = null;
  }

  startGame() {
    this.cpConfig = {
      type: Phaser.AUTO,
      width: this.width,
      height: this.height,
      parent: "ClubPenguin",
      dom: {
        createContainer: true,
      },
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: function(){
          this.played = false;
	  console.log(`${media}content/base/shell/background.svg`);
          this.load.svg("cp_bc", `${media}content/base/shell/background.svg`);

          this.load.script("loader", `${media}client/loader.js`);
          this.load.spritesheet(
            "loader_im",
            `${media}content/base/loader/minecart.png`,
            { frameWidth: 195, frameHeight: 197, startFrame: 0, endFrame: 53 }
          );
        },
        create: function() {
          // SET THE BACKGROUND
          cp.myScene = this;
          this.cp_bc = this.add.image(0, 0, "cp_bc");
          this.cp_bc.setOrigin(0);
          this.cp_bc.displayWidth = this.game.canvas.width;
          this.cp_bc.displayHeight = this.game.canvas.height;

          this._loader = new loader();
          this._loader.startLoaderScreen();
        },
        update: function() {
          if (!this.played) {
            this._loader.loadFiles(
              "xmlConvert",
              [`${media}content/libraries/xml2json.js`],
              () => {}
            );
            this._loader.loadFiles(
              "jsonConvert",
              [`${media}content/libraries/json2xml.js`],
              () => {}
            );
            this._loader.loadFiles(
              "crypt",
              [`${media}content/libraries/md5.js`],
              () => {}
            );
            this._loader.getPlugins(function() {
              if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                const plugins = JSON.parse(this.responseText);
                console.log(plugins);
                cp.getCurrentLoader.handleDependencies(
                  "plugins",
                  plugins,
                  true
                );
              }
            });
            this._loader.getDependencies(function() {
              if (this.readyState == 4 && this.status == 200) {
                const dependencies = JSON.parse(this.responseText);
                cp.getCurrentLoader.handleDependencies(
                  "boot",
                  dependencies,
                  false
                );
                // LOAD LOGIN FILES - PUT THIS IN CALLBACK TO PREVENT THEM FROM BEING
                // EXECUTED AT THE SAME TIME
                cp.getCurrentLoader.handleDependencies(
                  "login",
                  dependencies,
                  false
                );
              }
            });

            this.played = true;
          }
        },
      },
    };

    this.game = new Phaser.Game(this.cpConfig, "game");
  }
  get getAllScenes() {
    return this.game.scene.scenes;
  }

  get getCurrentLoader() {
    return this._loader;
  }
  get getCurrentLogin() {
    return this._login.__proto__;
  }
  get getCurrentShell() {
    return this._shell;
  }
  get getCurrentEngine() {
    return this._engine;
  }
  get getCurrentAirtower() {
    return this._airtower;
  }
  get getCurrentCrumbs() {
    return this._crumbs;
  }
}

window.onload = function () {
  cp = new clubpenguin(1000, 630);
  cp.startGame();
};
