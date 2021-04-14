import React, {Component} from 'react';
//import About from './About';

class Navbar extends Component {

    render() {
        return(
            <nav className="navbar">
                <ul className="navbar--link">
                   <li className="navbar--link-item">Home</li>
                   <li className="navbar--link-item">About</li>
                   <li className="navbar--link-item" style={{float: 'right'}} onClick={
                       this.props.handler}>{ (this.props.address) ? (this.props.address) : "Connect Wallet" }</li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;