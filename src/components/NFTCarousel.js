import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

class NFTCarousel extends Component {
    render() {
        return (
        <div className="row text-center">
         { this.props.tokens.length > 0 &&
            <Carousel showArrows={false} showThumbs={false} infiniteLoop={true} dynamicHeight={true} 
            interval="5000" transitionTime="2000" autoPlay={true} stopOnHover={true} statusFormatter={function (){ return null }}>
            {this.props.tokens.map((token, key) => {
            return(
            <div key={key} className="col-md-3 mb-3" onClick={() => window.open(token.openseaURI)}>
                <img src={token.URI} alt="loading"/>
            </div>
            )
        })}
       </Carousel>
    }
      </div>
    )     
  }
}

export default NFTCarousel;
