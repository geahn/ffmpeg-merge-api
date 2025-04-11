# 🎧 FFmpeg Merge API

API pública para unir dois arquivos de áudio `.wav` ou `.mp3` em um único `.mp3`, usando FFmpeg em ambiente serverless (hospedado na Vercel).

---

## 🔗 Endpoint

```
POST https://ffmpeg-merge-api.vercel.app/api/merge
```

---

## 📥 Requisição

### Headers

```
Content-Type: application/json
```

### Body (JSON)

```json
{
  "url1": "https://link-do-primeiro-audio.wav",
  "url2": "https://link-do-segundo-audio.mp3"
}
```

- `url1` e `url2`: URLs públicas e diretas dos arquivos `.wav` ou `.mp3` que você quer unir.
- Os arquivos podem ser do mesmo formato ou mistos.

---

## 📤 Resposta

- A resposta será um único arquivo `.mp3` com os dois áudios unidos.
- O arquivo é retornado direto no corpo da resposta (`Content-Type: audio/mpeg`), pronto para ser baixado, tocado ou enviado para outro serviço.

---

## 🧪 Exemplo com cURL

```bash
curl -X POST https://ffmpeg-merge-api.vercel.app/api/merge \
  -H "Content-Type: application/json" \
  -d '{
    "url1": "https://example.com/audio1.wav",
    "url2": "https://example.com/audio2.mp3"
  }' --output merged.mp3
```

---

## ⚠️ Limitações

- Apenas arquivos `.wav` ou `.mp3` são aceitos como entrada.
- O tamanho máximo de cada áudio deve respeitar os limites de tempo de execução da Vercel (10s a 60s em planos gratuitos).
- As URLs devem estar publicamente acessíveis (sem autenticação ou proteção).

---

## 🧹 Limpeza

Todos os arquivos temporários usados no processo são apagados automaticamente após a finalização.

---

## 🤝 Feito com 💙 para uso livre

Se usar essa API em algum projeto, me avisa! Vai ser massa ver pra onde isso vai. 😄
