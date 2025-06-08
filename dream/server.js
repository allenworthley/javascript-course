import * as dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/dream', async (req, res) => {
  try {
    const prompt = req.body.prompt;

  const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      tools: [{type: "image_generation"}],
  });

  const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

    if (imageData.length > 0) {
      const imageBase64 = imageData[0];
      const imageBuffer = Buffer.from(imageBase64, "base64");

      const fileName = `sprite-${Date.now()}.png`;
      const filePath = path.join("public", "images", fileName);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(filePath);

      const imageUrl = `/images/${fileName}`;
      return res.json({ url: imageUrl });
    }

    res.send({ imageBase64 });
  } catch (error) {
    console.error(error)
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

app.listen(8080, () => console.log('make art on http://localhost:8080/dream'));
