const { PassThrough } = require("stream");
const { createWriteStream, createReadStream } = require("fs");
const readStream = createReadStream("./input.json");
const writeStream = createWriteStream("./output.txt");

const tunnel = new PassThrough();
let extraChars = "";
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
function processChunk(str) {
  if (extraChars !== "") {
    str = extraChars + str;
    extraChars = "";
  }
  if (str[0] !== "[") {
    str = "[" + str;
  }
  let i;
  try {
    i = 1;
    while (
      i < str.length &&
      !IsJsonString(str.slice(0, str.length - i) + "]")
    ) {
      i++;
    }
    extraChars = str.slice(-1 * i).substring(1);
    console.log("Chunk #", chunkIndex + 1);
    console.log(JSON.parse(str.slice(0, str.length - i) + "]"));
  } catch (e) {
    console.log("extra----------------------\n\n\n\n\n\n\n", extraChars);
    console.log("str----------------------\n\n\n\n\n\n\n", str);
    console.log(
      "error for str-------------------------\n\n\n\n",
      str.slice(0, str.length - i) + "]"
    );
  }
}
let buff = "";
let chunkIndex = 0;
let y = 0;
tunnel
  .on("data", (chunk) => {
    try {
      buff += chunk.toString();
      processChunk(buff);
      chunkIndex++;
      buff = "";
    } catch (e) {
      y++;
      console.log(e);
    }
  })
  .on("end", function () {
    console.log("iteration", chunkIndex);
    console.log("fails", y);
  });

readStream.pipe(tunnel).pipe(writeStream);
