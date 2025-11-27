const keys = "abcdefghijklmnopqrstuvwxyz0123456789";
let keyMap = new Map();

function randomKey(length = 64) {
  let key = "";

  for (let i = 0; i < length; i++) {
    key += keys.charAt(Math.floor(Math.random() * 36));
  };

  return key
};