import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fetch from 'node-fetch';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Definir o diretório temporário
const TEMP_DIR = process.env.TEMP_DIR || '/tmp'; // Usando a variável de ambiente para controlar o diretório temporário

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url1, url2 } = req.body;

    if (!url1 || !url2) {
      return res.status(400).json({ error: 'As URLs dos arquivos de áudio são necessárias' });
    }

    // Gerar os caminhos para os arquivos temporários
    const input1 = path.join(TEMP_DIR, `temp_${uuidv4()}.wav`);
    const input2 = path.join(TEMP_DIR, `temp_${uuidv4()}.wav`);
    const output = path.join(TEMP_DIR, `merged_${uuidv4()}.mp3`);

    const downloadFile = async (url, filename) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Falha ao baixar o arquivo de áudio: ${url}`);
      }
      const buffer = await response.buffer();
      fs.writeFileSync(filename, buffer);
    };

    // Baixar os arquivos de áudio
    await downloadFile(url1, input1);
    await downloadFile(url2, input2);

    // Processar os áudios com FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(input1)
        .input(input2)
        .on('end', resolve)
        .on('error', (err) => {
          // Captura o erro e envia para o cliente
          reject({ message: 'Erro ao processar os arquivos de áudio', details: err });
        })
        .mergeToFile(output, TEMP_DIR);
    });

    // Ler o arquivo gerado e enviar como resposta
    const mergedBuffer = fs.readFileSync(output);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(mergedBuffer);

    // Limpeza dos arquivos temporários
    fs.unlinkSync(input1);
    fs.unlinkSync(input2);
    fs.unlinkSync(output);

  } catch (err) {
    // Resposta detalhada de erro
    if (err.details) {
      res.status(500).json({
        error: err.message,
        details: err.details, // Exibe os detalhes do erro
      });
    } else {
      res.status(500).json({ error: 'Erro interno ao mesclar os áudios' });
    }
  }
}
