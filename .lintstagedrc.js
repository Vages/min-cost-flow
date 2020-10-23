module.exports = {
  "*": (paths) => [`xo --fix ${paths.join(" ")}`, "yarn test", "tsc --noEmit"],
};
