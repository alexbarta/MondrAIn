import React, {Component} from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import About from './About';


class TopNavbar extends Component {
    state = {
        showAboutModal: false
    }

    selectModal = (info) => {
        this.setState({showAboutModal: !this.state.showAboutModal}) // true/false toggle
     }

    render() {
        return(
                <Navbar>
                    <Navbar.Brand href="#home">MondrAIn</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav defaultActiveKey="#home" className="mr-auto">
                        <Nav.Link >Home</Nav.Link>
                        <Nav.Link onClick={this.selectModal}><About showModal={this.state.showAboutModal} hideModal={this.selectModal}/>About</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav.Link onClick={this.props.handler}>{ (this.props.address) ? (this.props.address) : "Connect Wallet" }</Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
        )
    }
}

export default TopNavbar;