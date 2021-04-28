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
      <Container className='social' style={{ padding: '15px 25px' }}>
        <Row xs='5' md='5' style={{ position: 'fixed', bottom: '5px', transform: 'translate(-50%, -50%)', left: '50%' }}>
          <Col>
            <a href='https://twitter.com/Mondrainxyz' className='twitter social'>
              <FontAwesomeIcon icon={faTwitter} size='2x' />
            </a>
          </Col>
          <Col>
            <a href='https://t.me/mondrAIn' className='Telegram social'>
              <FontAwesomeIcon icon={faTelegram} size='2x' />
            </a>
          </Col>
          <Col>
            <a href='https://discord.gg/wqDbKXVXK2' className='Discord social'>
              <FontAwesomeIcon icon={faDiscord} size='2x' />
            </a>
          </Col>
          <Col>
            <a href='https://github.com/alexbarta/MondrAIn' className='Github social'>
              <FontAwesomeIcon icon={faGithub} size='2x' />
            </a>
          </Col>
          <Col>
            <a href={this.props.contractAddress ? 'https://explorer-mumbai.maticvigil.com/address/' + this.props.contractAddress + '/transactions' : 'https://explorer-mumbai.maticvigil.com'} className='Contract social'>
              <FontAwesomeIcon icon={faFileContract} size='2x' />
            </a>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Social
