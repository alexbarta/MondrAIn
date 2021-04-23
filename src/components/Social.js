import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import {
    faTwitter,
    faTelegram,
    faDiscord,
    faGithub
  } from "@fortawesome/free-brands-svg-icons";

class Social extends Component {
    render() {
        return (
            <div className="social">
               <div className="social container">
               <a href="https://twitter.com/Mondrainxyz" className="twitter social">
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
               </a>
               <a href="" className="Telegram social">
                    <FontAwesomeIcon icon={faTelegram} size="2x" />
               </a>
               <a href="" className="Discord social">
                    <FontAwesomeIcon icon={faDiscord} size="2x" />
               </a>               
               <a href="https://github.com/alexbarta/MondrAIn" className="Github social">
                    <FontAwesomeIcon icon={faGithub} size="2x" />
               </a>
               <a href="https://rinkeby.etherscan.io/address/0x8Da3810ec246d519e33F1905bc5f34191B60bf07" className="Contract social">
                    <FontAwesomeIcon icon={faFileContract} size="2x" />
               </a>
               </div>
            </div>
            )
        }
    }
    
export default Social;