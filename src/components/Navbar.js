import React, {Component} from 'react';
import Modal from './Modal';
import About from './About';


class Navbar extends Component {
    state = {
        modal: false
    }
      
    selectModal = (info) => {
       this.setState({modal: !this.state.modal}) // true/false toggle
    }

    render() {
        return(
            <nav className="navbar">
                <ul className="navbar--link">
                   <li className="navbar--no-link-item">MondrAIn</li>
                   <li className="navbar--link-item" onClick={this.selectModal}><Modal displayModal={this.state.modal} closeModal={this.selectModal} displayInfo={<About/>}/>About</li>
                   <li className="navbar--link-item" style={{float: 'right'}} onClick={
                       this.props.handler}>{ (this.props.address) ? (this.props.address) : "Connect Wallet" }</li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;