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
               <a href="https://explorer-mumbai.maticvigil.com/address/0xF0D41B77a8C101Ede713e5Ae722657C21062D829/transactions" className="Contract social">
                    <FontAwesomeIcon icon={faFileContract} size="2x" />
               </a>
               </div>
            </div>
            )
        }
    }
    
export default Social;