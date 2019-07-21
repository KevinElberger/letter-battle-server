module.exports = {
  stringGen(len) {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz";

    const getVowels = (str) => {
      var m = str.match(/[aeiou]/gi);
      return m === null ? 0 : m.length;
    }

    for (var i = 0; i < len; i++) {
      const char = charset.charAt(Math.floor(Math.random() * charset.length));

      if (text.indexOf(char) === -1) {
        text += char;
      }
    }

    if (getVowels(text) < 2 || text.length !== len) {
      return this.stringGen(len);
    }

    return text;
  }
}