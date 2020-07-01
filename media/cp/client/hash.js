class hash {
  start() {
    cp.hash = this;
  }
  swapped_md5(data) {
    var password = md5(data);
    return password.slice(16, 32) + password.slice(0, 16);
  }
  hashPass(pass, rndk) {
    return this.swapped_md5(
      this.swapped_md5(pass).toUpperCase() + rndk + cp.crumbs.magic
    );
  }
  hashLoginKey(loginkey, rndk) {
    return this.swapped_md5(loginkey + rndk) + loginkey;
  }
}
