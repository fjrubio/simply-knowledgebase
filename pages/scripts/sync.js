const glob = require("glob");
const fs = require("fs");
const fetch = require("node-fetch");
// your Embedbase api key
const apiKey = "b7278d6f-0be7-420b-9401-f6f499c380c2"//process.env.EMBEDBASE_API_KEY;

const sync = async () => {
 // 1. read all files under pages/* with .mdx extension
 // for each file, read the content
 const documents = glob.sync("pages/**/*.mdx").map((path) => ({
  // we use as id /{pagename} which could be useful to
  // provide links in the UI
  id: path.replace("pages/", "/").replace("index.mdx", "").replace(".mdx", ""),
  // content of the file
  data: fs.readFileSync(path, "utf-8")
 }));
 
 // 2. here we split the documents in chunks, you can do it in many different ways, pick the one you prefer
 // split documents into chunks of 100 lines
 const chunks = [];
 documents.forEach((document) => {
  const lines = document.data.split("\n");
  const chunkSize = 100;
  for (let i = 0; i < lines.length; i += chunkSize) {
   const chunk = lines.slice(i, i + chunkSize).join("\n");
    chunks.push({
      data: chunk
   });
  }
 });

 // 3. we then insert the data in Embedbase
 //const response = await fetch("https://embedbase-hosted-usx5gpslaq-uc.a.run.app/v1/documentation", { // "documentation" is your dataset ID
const response = await fetch("https://api.embedbase.xyz/v1/simply-knowledgebase", { // "documentation" is your dataset ID
 method: "POST",
  headers: {
   "Authorization": "Bearer " + apiKey,
   "Content-Type": "application/json"
  },
  body: JSON.stringify({
   documents: chunks
  })
 });
 const data = await response.json();
 console.log(data);
}
sync();