import React, { Component } from 'react'
import { Table, Jumbotron } from 'react-bootstrap'

class Lottery extends Component {

  render () {
    //console.log(JSON.stringify(this.props.winners))
    const winnerEntries = [];
    for (const winner of this.props.winners) {
      //convert block unix time to date
      let date = new Date(winner.returnValues.timestamp * 1000);
      let tokenAmount = parseInt(winner.returnValues.tokenAmount) / (10 ** 18)
      winnerEntries.push(<tr><th>{winner.returnValues.winnerAddress}</th><th>{tokenAmount}</th><th>{date.toString().slice(0, 24)}</th></tr>)
    }  

    return (
<Jumbotron>
<Table striped bordered hover variant="dark">
  <thead>
    <tr>
      <th>Latest Winners</th>
      <th>XMD Won</th>
      <th>Timestamp</th>
    </tr>
  </thead>
  <tbody>
    {winnerEntries.reverse()}
  </tbody>
</Table>
</Jumbotron>

    )
  }
}

export default Lottery;
