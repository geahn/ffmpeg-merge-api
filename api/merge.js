import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fetch from 'node-fetch';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url1, url2 } = req.body;

    // Detecta extensão real baseada na URL (aceita .mp3 e .wav)
    const ext1 = path.extname(url1).toLowerCase().includes('mp3') ? '.mp3' : '.wav';
    const ext2 = path.extname(url2).toLowerCase().includes('mp3') ? '.mp3' : '.wav';

    const input1 = `/tmp/temp_${uuidv4()}${ext1}`;
    const input2 = `/tmp/temp_${uuidv4()}${ext2}`;
    const output = `/tmp/merged_${uuidv4()}.mp3`;

    const downloadFile = async (url, filename) => {
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(filename, buffer);
    };

    await downloadFile(url1, input1);
    await downloadFile(url2, input2);

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(input1)
        .input(input2)
        .audioCodec('libmp3lame') // garante que o output seja mp3
        .on('end', resolve)
        .on('error', reject)
        .mergeToFile(output, '/tmp');
    });

    const mergedBuffer = fs.readFileSync(output);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(mergedBuffer);

    // Limpa os arquivos temporários
    fs.unlinkSync(input1);
    fs.unlinkSync(input2);
    fs.unlinkSync(output);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao mesclar os áudios' });
  }
}
