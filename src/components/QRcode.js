import { useEffect, useState } from "react";
import shiba from '../img/shiba.jpeg'

const { AwesomeQR } = require("awesome-qr");

export const getQRBuffer = async (text) => {
  var buffer = await new AwesomeQR({
  text: text,
  //size: 500,
  //gifBackground: dogeBuffer,
  backgroundImage: shiba,
  backgroundDimming: "rgba(255,255,255,0.2)",
  }).draw();
  return buffer;
}


/*export const QRCodeGenerate = (props) => {
  const { text } = props.text
  const [buffer, setBuffer] = useState('');
  useEffect(() => {
    console.log("nonna")
    getQRBuffer(text).then(data => setBuffer(data))
  }, [text])
  return buffer

}*/






/*import { AwesomeQRCode } from "@awesomeqr/react";

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const AnimatedBackgroundExample = () => {
  const [gifArrayBuffer, setGifArrayBuffer] = useState();

  useEffect(() => {
    (async () => {
      const arrayBuffer = await fetch("../im/dog.gif").then((res) => res.arrayBuffer());
      setGifArrayBuffer(arrayBuffer);
      console.log(ab2str(arrayBuffer));
    })();
  }, []);

  console.log(ab2str(gifArrayBuffer));
  return (
          <AwesomeQRCode
            options={{
              text: "test",
              //backgroundDimming: "rgba(255,255,255,0.2)",
              gifBackground: gifArrayBuffer,
            }}
          />
        )
}


export default AnimatedBackgroundExample;*/
