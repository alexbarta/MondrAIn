import shiba from '../img/dogecoin.jpeg'

const { AwesomeQR } = require('awesome-qr')

export const getQRBuffer = async (text) => {
  const buffer = await new AwesomeQR({
    text: text,
    // size: 500,
    // gifBackground: dogeBuffer,
    backgroundImage: shiba,
    backgroundDimming: 'rgba(255,255,255,0.2)'
  }).draw()
  return buffer
}
