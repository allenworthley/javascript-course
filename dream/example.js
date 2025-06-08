import OpenAI from "openai";
import 'dotenv/config';
const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
console.log({apiKey: process.env.OPENAI_API_KEY})

const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools: [{type: "image_generation"}],
});

const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("otter2.png", Buffer.from(imageBase64, "base64"));
}