const fs = require('fs');

//  check does folder exist
const ensureDirectoryExistence = filePath => {
  if (fs.existsSync(filePath)) {
    return 1;
  }
  fs.mkdirSync(filePath);
  ensureDirectoryExistence(filePath);
};

//  file sharding
const shardFile = (file, shardsNumber = 3) => {
  // console.log(file.name, shardsNumber);
  const pieceSize = Math.floor((file.size - (file.size % shardsNumber)) / shardsNumber);
  const rest = file.size % shardsNumber;
  const resultArray = [];
  for (let i = 0; i <= shardsNumber - 1; i++) {
    let zeroPoint = pieceSize * i;
    const endPoint = pieceSize * (i + 1);
    if (i === shardsNumber - 1) {
      zeroPoint = (file.size - (pieceSize + rest));
      resultArray.push(file.data.substring(zeroPoint));
      // console.log(zeroPoint);
      // console.log(file.data.substring(zeroPoint));
      break;
    }
    resultArray.push(file.data.substring(zeroPoint, endPoint));
    // console.log(zeroPoint);
    // console.log(file.data.substring(zeroPoint, endPoint));
    // console.log(endPoint);
  }
  // resultArray.map(shard => { console.log(zeroPoint); console.log(shard); return console.log(endPoint); });
  // console.log(file.size, rest, pieceSize);
  return resultArray;
};

module.exports = {
  ensureDirectoryExistence,
  shardFile
};
