///<reference path="../typings/index.d.ts"/>

import Dictionary  from "./Dictionary";
import Generator, {Capitalisation} from "./Generator";

let gerDict = new Dictionary("German");

let generator = new Generator(gerDict);

generator.capitalisation = Capitalisation.CAMEL_CASE;

for (var i = 0; i < 20; i++) {
  console.log("New Password:", generator.generatePassword());
}
