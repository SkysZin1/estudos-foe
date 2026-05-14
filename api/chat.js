import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const FOE_CONTEXT = `
Você é um monitor de Fenômenos Ondulatórios e Eletromagnéticos.
Responda em português brasileiro, com linguagem simples e didática.

O aluno está estudando:
- Potencial elétrico
- Capacitância
- Campo magnético
- Força magnética
- Lei de Ampère
- Leis de Kirchhoff
- Associação de resistores
- Circuito RC

Regras:
- Explique passo a passo quando for cálculo.
- Mostre a fórmula antes de substituir valores.
- Avise quando precisar converter unidades.
- Não invente conteúdos fora desses temas.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Pergunta inválida" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-5.4-nano",
      messages: [
        { role: "system", content: FOE_CONTEXT },
        { role: "user", content: question }
      ],
      temperature: 0.4
    });

    return res.status(200).json({
      answer: response.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao consultar a IA"
    });
  }
}