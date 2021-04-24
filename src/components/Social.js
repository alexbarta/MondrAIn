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
                    <FontAwesomeIcon icon={faTwitter} size="3x" />
               </a>
               <a href="" className="Telegram social">
                    <FontAwesomeIcon icon={faTelegram} size="3x" />
               </a>
               <a href="https://discord.gg/wqDbKXVXK2" className="Discord social">
                    <FontAwesomeIcon icon={faDiscord} size="3x" />
               </a>               
               <a href="https://github.com/alexbarta/MondrAIn" className="Github social">
                    <FontAwesomeIcon icon={faGithub} size="3x" />
               </a>
               <a href="https://explorer-mumbai.maticvigil.com/address/0x36d4417b805B12A64f265c88432618F3148c4586/transactions" className="Contract social">
                    <FontAwesomeIcon icon={faFileContract} size="3x" />
               </a>
               </div>
            </div>
            )
        }
    }
    
export default Social;