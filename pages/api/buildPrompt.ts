// pages/api/buildPrompt.ts
import { get_encoding } from "@dqbd/tiktoken";
// Load the tokenizer which is designed to work with the embedding model
const enc = get_encoding('cl100k_base');
const apiKey = process.env.EMBEDBASE_API_KEY;
// this is how you search Embedbase with a string query
const search = async (query: string) => {
 return fetch("https://api.embedbase.xyz/v1/simply-knowledgebase/search", {
  method: "POST",
  headers: {
   Authorization: "Bearer " + apiKey,
   "Content-Type": "application/json"
  },
  body: JSON.stringify({
   query: query
  })
 }).then(response => response.json());
};
const createContext = async (question: string, maxLen = 1800) => {
 // get the similar data to our query from the database
 const searchResponse = await search(question);
 let curLen = 0;
 const returns = [];
 // We want to add context to some limit of length (tokens)
 // because usually LLM have limited input size
 for (const similarity of searchResponse["similarities"]) {
  const sentence = similarity["data"];
  // count the tokens
  const nTokens = enc.encode(sentence).length;
  // a token is roughly 4 characters, to learn more
  // https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
  curLen += nTokens + 4;
  if (curLen > maxLen) {
   break;
  }
  returns.push(sentence);
 }
 // we join the entries we found with a separator to show it's different
 return returns.join("\n\n###\n\n");
}
// this is the endpoint that returns an answer to the client
export default async function buildPrompt(req, res) {
 const prompt = req.body.prompt;
 const context = await createContext(prompt);
 const newPrompt = `Eres un experto del sistema de salud Chileno y trabajas para Empresas Banmedica. Responde a la pregunta basándote en el contexto a continuación, y si la pregunta no puede ser respondida basándote en el contexto, responde "No lo sé".\n\nContexto: ${context}\n\n---\n\nPregunta: ${prompt}\nRespuesta:`;
 res.status(200).json({ prompt: newPrompt });
}