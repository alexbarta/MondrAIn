import React, { Component } from 'react'
import { Carousel, Tooltip, OverlayTrigger, Container, Row, Col } from 'react-bootstrap'

class NFTCarousel extends Component {
  render () {
    return (
      <Container>
        <Row>
          <Col className='col text-center' style={{'color': 'aquamarine'}}>
            <h2>Last Minted Tokens</h2>
          </Col>
        </Row>
        <Row>
          <Col className='col text-center'>
            <Carousel>
              {this.props.tokens.map((token, key) => {
                return (
                  <Carousel.Item key={key} onClick={() => window.open(token.explorerURL)}>
                    <OverlayTrigger
                      key='bottom' placement='bottom' overlay={
                            <Tooltip id={`tooltip-carousel-${key}`}>
                            Check me out on AVAX explorer!
                          </Tooltip>
                }
                    >
                      <img src={token.URI} alt='loading' style={{ cursor: 'pointer' }} />
                    </OverlayTrigger>
                  </Carousel.Item>
                )
              })}
            </Carousel>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default NFTCarousel
