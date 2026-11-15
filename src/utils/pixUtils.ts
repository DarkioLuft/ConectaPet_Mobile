// src/utils/pixUtils.ts

function formatEMVField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

function normalizeText(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function computeCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload({
  pixKey,
  merchantName,
  merchantCity,
  txid = 'CONECTAPET',
}: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  txid?: string;
}): string {
  // Limpa formatação caso a chave seja CNPJ ou telefone
  const cleanKey = pixKey.includes('@')
    ? pixKey.trim()
    : pixKey.replace(/[^\d+]/g, '');

  const name = normalizeText(merchantName || 'ONG PARCEIRA', 25) || 'ONG';
  const city = normalizeText(merchantCity || 'BRASIL', 15) || 'BRASIL';

  const gui = formatEMVField('00', 'br.gov.bcb.pix');
  const keyField = formatEMVField('01', cleanKey);
  const merchantAccountInfo = formatEMVField('26', `${gui}${keyField}`);

  const additionalData = formatEMVField('62', formatEMVField('05', txid));

  const payloadWithoutCrc = [
    formatEMVField('00', '01'), // Payload Format Indicator
    merchantAccountInfo,
    formatEMVField('52', '0000'), // Merchant Category Code
    formatEMVField('53', '986'), // Moeda (BRL)
    formatEMVField('58', 'BR'), // País
    formatEMVField('59', name),
    formatEMVField('60', city),
    additionalData,
    '6304', // ID + Tamanho do CRC16
  ].join('');

  return `${payloadWithoutCrc}${computeCRC16(payloadWithoutCrc)}`;
}