import mondrian from '../img/qr-code.jpeg'


const { AwesomeQR } = require('awesome-qr')

export const getQRBuffer = async (text) => {
  const buffer = await new AwesomeQR({
    text: text,
    size: 400,
    whiteMargin: true,
    autoColor: false,
    margin: 15,
    //gifBackground: dogeBuffer,
    backgroundImage: mondrian
    //backgroundDimming: 'rgba(255,255,255,0.2)'
  }).draw()
  return buffer
}
