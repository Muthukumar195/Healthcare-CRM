import React from "react"
import { 
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
 } from "reactstrap"
import FaqQuestions from "./FaqQuestions"
import config from '../../configs/index'
import { ChevronDown, Search } from "react-feather";
import "../../assets/scss/pages/faq.scss"
import loginImg from "../../assets/img/logo/logo.png";

class Help extends React.Component {
  state = {
    value: ""
  }
  onChange = event => {
    let searchText = event.target.value.toLowerCase()
    this.setState({
      value: searchText
    })
  }
  render() {
    return (
      <React.Fragment>
        <div className="custom-navbar-dark" data-test="headerComponent">
          <Navbar color="dark" dark expand="md" sticky="top">
            <NavbarBrand href={config.webBaseUrl}>
              <img 
                src={loginImg} 
                alt="loginImg" 
                width="165"
                className="d-inline-block align-middle"
              data-test="logoIMG"/>
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} />
            <Collapse navbar isOpen={!this.state.collapsed}>
              <Nav className="ml-auto" navbar>
                <NavItem><NavLink href={config.webBaseUrl}>Home</NavLink></NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/patient-journey/'}>Patient Journey</NavLink></NavItem>
                <NavItem>
                    <NavLink href={config.webBaseUrl + '/provider-journey/'}>Provider Journey<ChevronDown size={15} className="ml-50" /></NavLink>
                    <Nav>
                      <NavItem>
                        <NavLink href={config.webBaseUrl + '/pricing/'}>Pricing</NavLink>
                      </NavItem>
                    </Nav>
                </NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/hospitals/'}>Hospitals</NavLink></NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/health-plans/'}>Health Plans</NavLink></NavItem>
                <NavItem><NavLink href="/doctor">Doctor Sign In</NavLink></NavItem>
                <NavItem><NavLink href="/patient">Patient Sign In</NavLink></NavItem>
                <NavItem><NavLink href=""><Search size={15} className="search-icon" /></NavLink></NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <Row className="m-0 mt-5 justify-content-center">
          <Col
            sm="10"
            xl="10"
            lg="10"
            md="10"
            className="my-2"
          >
            <Row>
              <Col sm="12">
                <Card className="faq-bg">
                  <CardBody className="p-sm-4 p-2">
                    <h1 className="white">Have Any Questions?</h1>
                    <p className="mb-2 white">
                      Frequently sked questions are listed below and also you can search here...
                    </p>
                    <form>
                      <FormGroup className="position-relative has-icon-left mb-0">
                        <Input
                          type="text"
                          placeholder="Search"
                          bsSize="lg"
                          value={this.state.value}
                          onChange={this.onChange}
                        />
                        <div className="form-control-position">
                          <Search size={14} />
                        </div>
                      </FormGroup>
                    </form>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="12">
                <div className="faq">
                  <Row>
                    <Col lg="12" md="12" sm="12">
                      <FaqQuestions value={this.state.value} />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      <div className="footer-nav">
        <Container>
          <Row>
            <Col md={4}>
              <h2 className="footer-title">Company</h2>
              <ul>
                <li><NavLink href={config.webBaseUrl + '/about-us/'}>About Us</NavLink></li>
                <li><NavLink href={config.webBaseUrl + '/contact-us/'}>Contact Us</NavLink></li>
                <li><NavLink href={config.webBaseUrl + '/technical-support/'}>Technical Support</NavLink></li>
                <li><NavLink href={config.webBaseUrl + '/pricing/'}>Pricing</NavLink></li>
              </ul>
            </Col>
            <Col md={4}>
              <h2 className="footer-title">TeleHealth Information</h2>
              <ul>
                <li><NavLink href="https://www.cms.gov/newsroom/fact-sheets/medicare-telemedicine-health-care-provider-fact-sheet" target="_blank">Telemedicine Fact Sheet</NavLink></li>
                <li><NavLink href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/telehealth.html" target="_blank">TeleHealth during COVID</NavLink></li>
                <li><NavLink href="https://www.medicaid.gov/medicaid/benefits/telemedicine/index.html" target="_blank">TeleHealth and Medicaid</NavLink></li>
              </ul>
            </Col>
            <Col md={4}>
              <h2 className="footer-title">Journeys / Product Information</h2>
              <ul>
                <li><NavLink href={config.webBaseUrl + '/patient-journey/'}>Patient</NavLink></li>
                <li><NavLink href={config.webBaseUrl + '/provider-journey/'}>Provider</NavLink></li>
                <li><NavLink href={config.webBaseUrl + '/hospitals/'}>Hospitals</NavLink></li>
                <li><NavLink href={config.webBaseUrl + '/health-plans/'}>Health Plans</NavLink></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="copyright-wrapper">
        <Container>
				  <Row>
            <Col md={12} className="text-center">
						  <p className="footerleft">© 2020 Telescrubs. All Rights Reserved</p>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
    )
  }
}
export default Help
