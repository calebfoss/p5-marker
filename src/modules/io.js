import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";

defineSnakeAlias("createWriter");

defineProperties({
  http_post: {
    set: function () {
      this.httpPost(...arguments);
    },
  },
  http_do: {
    set: function () {
      this.httpDo(...arguments);
    },
  },
  save_file: {
    set: function () {
      this.save(...arguments);
    },
  },
  save_json_file: {
    set: function () {
      this.saveJSON(...arguments);
    },
  },
  save_strings_file: {
    set: function () {
      this.saveStrings(...arguments);
    },
  },
  save_table_file: {
    set: function () {
      this.saveTable(...arguments);
    },
  },
});
