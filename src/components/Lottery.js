import React, { Component } from 'react'
import { Table, Row, Col, Jumbotron } from 'react-bootstrap'

function start_and_end(str) {
  if (str.length > 35) {
    return str.substr(0, 10) + '...' + str.substr(str.length-10, str.length);
  }
  return str;
}

class Lottery extends Component {

  render () {
    //console.log(JSON.stringify(this.props.winners))
    const winnerEntries = [];
    for (const winner of this.props.winners) {
      //convert block unix time to date
      let date = new Date(winner.returnValues.timestamp * 1000);
      let tokenAmount = parseInt(winner.returnValues.tokenAmount) / (10 ** 18)
      winnerEntries.push(<tr><th>{start_and_end(winner.returnValues.winnerAddress)}</th><th>{tokenAmount}</th><th>{date.toString().slice(4, 24)}</th></tr>)
    }  

    return (
<Jumbotron style={{'margin-top' : '50px'}}>
<Row>
  <Col className="col text-center">
    <h2>Latest XMD Winners</h2> 
  </Col>
</Row>
<Table striped bordered hover variant="dark">
  <thead>
    <tr>
      <th>Latest Winners</th>
      <th>XMD Won</th>
      <th>Timestamp</th>
    </tr>
  </thead>
  <tbody>
    {winnerEntries.reverse().slice(0,5)}
  </tbody>
</Table>
<Col className="col text-center">
    <h5>Quadro: 0xC62518961E28f64f7EcC79C3FD5677aCef11fD0B</h5> 
    <h5>XMD: 0xCdfDc8195F4166c2e491d7Bb50AB2C00C6f9F542</h5>
</Col>
</Jumbotron>
    )
  }
}

export default Lottery;
