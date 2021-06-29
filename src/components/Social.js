import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import {
  faTwitter,
  faTelegram,
  faDiscord,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

import { Container, Row, Col } from 'react-bootstrap'

class Social extends Component {
  render () {
    return (
        <Container className='social'>
          <Row xs='5' md='5' style={{'justify-content': 'center', 'margin-bottom': '10px'}}>
          <Col  xs={2} lg={1}>
            <a href='https://twitter.com/Mondrainxyz' className='twitter social'>
              <FontAwesomeIcon icon={faTwitter} size='2x' />
            </a>
          </Col>
          <Col  xs={2} lg={1}>
            <a href='https://t.me/mondrAIn' className='Telegram social'>
              <FontAwesomeIcon icon={faTelegram} size='2x' />
            </a>
          </Col>
          <Col  xs={2} lg={1}>
            <a href='https://discord.gg/wqDbKXVXK2' className='Discord social'>
              <FontAwesomeIcon icon={faDiscord} size='2x' />
            </a>
          </Col>
          <Col  xs={2} lg={1}>
            <a href='https://github.com/alexbarta/MondrAIn' className='Github social'>
              <FontAwesomeIcon icon={faGithub} size='2x' />
            </a>
          </Col>
          <Col  xs={2} lg={1}>
            <a href={this.props.contractAddressERC721 ? this.props.explorerURL + '/address/' + this.props.contractAddressERC721 : this.props.explorerURL } className='Contract social'>
              <FontAwesomeIcon icon={faFileContract} size='2x' />
            </a>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Social

//{/*       <Container className='social' style={{ padding: '15px 25px' }}>
//<Row xs='5' md='5' style={{ position: 'fixed', bottom: '5px', transform: 'translate(-50%, -50%)', left: '50%', background: 'white' }}> */}