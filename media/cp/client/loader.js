class loader {
  constructor() {
    this.TO_LOAD = null;
    this.loadedDepends = [];
    this.toLoad = [];
    this.plugins = [];
    this.currentlyLoaded = [];
    this.cp = cp.myScene;
    cp._loader = this;
    this.myScene = null;
  }
  startLoaderScreen() {
    //delete all loaded objects from the screen
    this.destroyAllObjects();
    console.log(this.cp);
    this.loader_im = this.addObject(
      [this.cp.game.canvas.width / 2 - 15, this.cp.game.canvas.height / 2 - 20],
      "sprite",
      "loader_im"
    );
    console.log(this.loader_im);
    this.loader_im.displayWidth = this.cp.game.canvas.width / 5;
    this.loader_im.displayHeight = this.cp.game.canvas.height / 3;
    this.cp.anims.create({
      key: "loader_am",
      frames: this.cp.anims.generateFrameNumbers("loader_im"),
      frameRate: 32,
      repeat: -1,
    });
    this.loader_im.play("loader_am");
  }
  destroyAllObjects() {
    for (var objNum in this.currentlyLoaded) {
      this.currentlyLoaded[objNum].destroy();
    }
    this.currentlyLoaded = [];
  }
  addObject(coords, objType) {
    var tempObj = null;
    var main = cp.myScene;
    var key = undefined;
    var extra = undefined;
    if (arguments[2] != undefined) {
      key = arguments[2];
    }
    if (objType === "html") {
      tempObj = main.add.dom(coords[0], coords[1], key);
    } else if (objType === "image") {
      tempObj = main.add.image(coords[0], coords[1], key);
    } else if (objType === "script") {
      tempObj = main.add.script(coords[0], coords[1], key);
    } else if (objType === "sprite") {
      tempObj = main.add.sprite(coords[0], coords[1], key);
    } else if (objType === "text") {
      tempObj = main.add.text(coords[0], coords[1], arguments[2], arguments[2]);
    } else if (objType === "container") {
      tempObj = main.add.container(coords[0], coords[1], key);
    }
    this.currentlyLoaded.push(tempObj);
    return tempObj;
  }
  get scene() {
    return this.sceneConfig;
  }
  getDependencies(callback) {
    //NOTES
    // CREATE HTTP REQUEST TO GET DEPENDENCIES, THEN CALLBACK
    var req = new XMLHttpRequest();
    req.onreadystatechange = callback;
    req.open("GET", media + "client/dependencies.json", true);
    req.send();
  }
  getPlugins(callback) {
    //NOTES
    // CREATE HTTP REQUEST TO GET PLUGINS, THEN CALLBACK
    var req = new XMLHttpRequest();
    req.onreadystatechange = callback;
    req.open("GET", media + "client/plugins.json", true);
    req.send();
  }
  loadFiles(key, files, callback) {
    cp.myScene.load.on("complete", callback);
    var useConfig = false;
    if (arguments[0] != undefined) {
      useConfig = true;
    }
    for (var fileNum in files) {
      var file = files[fileNum];
      if (file.endsWith(".js")) {
        cp.myScene.load.script(key, file);
      } else if (file.endsWith(".png") || file.endsWith(".jpg")) {
        if (useConfig && useConfig[0] == "spritesheet") {
          cp.myScene.load.spritesheet(key, file, useConfig[1]);
        } else {
          cp.myScene.load.image(key, file);
        }
      } else if (file.endsWith(".html")) {
        cp.myScene.load.html(key, file);
      }
    }
    cp.myScene.load.start();
  }
  handleDependencies(TO_LOAD, dependencies, plugin) {
    // the function to call once it is done
    cp.myScene.load.on("complete", cp.getCurrentLoader.addDependencies);
    for (var dependencyNum in dependencies[TO_LOAD]) {
      var dependency = dependencies[TO_LOAD][dependencyNum];
      if (!plugin) {
        cp.myScene.load.script(
          dependency["key"],
          media + "client/" + dependency["id"] + ".js"
        );
      } else {
        console.log(dependency["key"]);
        cp.myScene.load.plugin(dependency["key"], dependency["id"], true);

        continue;
      }
      if (dependency["scene"]) {
        cp.getCurrentLoader.loadedDepends.push(dependency["key"]);
      } else if (!dependency["scene"]) {
        cp.getCurrentLoader.toLoad.push(dependency["key"]);
      }
    }
    cp.myScene.load.start();
  }
  addDependencies() {
    // add all files in the loadedDepends var into the main scene
    for (var dependencyNum in cp.getCurrentLoader.loadedDepends) {
      var dependency = eval(cp.getCurrentLoader.loadedDepends[dependencyNum]);
      var temp = new dependency();
      console.log(
        "adding scene with key: ",
        cp.getCurrentLoader.loadedDepends[dependencyNum]
      );
      cp.myScene.scene.add(
        cp.getCurrentLoader.loadedDepends[dependencyNum],
        temp.scene,
        true
      );
    }
    for (var dependencyNum in cp.getCurrentLoader.toLoad) {
      var dependency = eval(cp.getCurrentLoader.toLoad[dependencyNum]);
      var temp = new dependency();
      console.log(
        "starting script with key: ",
        cp.getCurrentLoader.toLoad[dependencyNum]
      );
      temp.start();
    }
    cp.getCurrentLoader.toLoad = [];
    cp.getCurrentLoader.loadedDepends = [];
  }
}
