import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  if (!data) throw new Error('No data provided for QR code generation');

  try {
    return await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw error;
  }
};

export const decodeQRData = (data: string) => {
  const [type, encodedData] = data.split(':');
  if (!type || !encodedData) {
    throw new Error('Invalid QR code format');
  }

  try {
    const decodedData = JSON.parse(atob(encodedData));
    return { type, data: decodedData };
  } catch (error) {
    throw new Error('Failed to decode QR data');
  }
};
