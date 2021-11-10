import React, { useEffect, useState, createRef } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  Elements,
  ElementsConsumer,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { connect } from "react-redux";
import {
  createPaymentIntent,
  saveAppointmentPayments,
} from "../../redux/actions/paymentActions";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  CardHeader,
  CardTitle,
} from "reactstrap";
import { CreditCard } from "react-feather";
import { Formik, Field, Form, ErrorMessage } from "formik";
import loginImg from "../../assets/img/logo/logo.png";
import "../../assets/scss/pages/authentication.scss";

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payment: [],
      appointment_payment_data: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.payment.status) {
      if (nextProps.payment.data != prevState.payment) {
        return { payment: nextProps.payment.data };
      }
    }
    if (nextProps.appointment_payment_data.status) {
      if (
        nextProps.appointment_payment_data.data !=
        prevState.appointment_payment_data
      ) {
        alert(nextProps.appointment_payment_data.status);
      }
    }
    return null;
  }

  componentDidMount() {
    this.props.createPaymentIntent({
      appointment_id: this.props.match.params.token,
    });
  }

  render() {
    const stripePromise = loadStripe(
      "pk_test_51HEoMTAWkhcS9lGWGKEhYX6FPtMKHdxagn2skEe6lG86s9gmicgBIVleJpt3Y9Cp5a2lOFQt9XcPZCGINezmz5JD00XVw2murX"
    );
    return (
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <Row className="m-0 justify-content-center">
              <Col md="9" className="d-flex justify-content-center">
                <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
                  <Row className="m-0">
                    <Col
                      lg="6"
                      className="d-lg-block d-none text-center align-self-center px-1 py-0"
                    >
                      <img src={loginImg} alt="loginImg" />
                    </Col>
                    <Col lg="6" md="12" className="p-0">
                      <Card className="rounded-0 mb-0 p-2">
                        <CardHeader>
                          <CardTitle className="w-100">
                            <Row>
                              <Col md="8" className="pr-0">
                                <h4 className="mb-0">Payment Information </h4>
                              </Col>
                              <Col md="4" className="pl-0">
                                <h3 className="mb-0 text-danger text-right">
                                  $99.00
                                </h3>
                              </Col>
                            </Row>
                          </CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              nameOnCard: "",
                              city: "",
                              address: "",
                              postal_code: "",
                              state: "",
                            }}
                            onSubmit={async (values, actions) => {
                              console.log(values);
                              // this.props.updatePreferences(values);
                              const payload = await stripe.confirmCardPayment(
                                this.state.payment.client_secret,
                                {
                                  payment_method: {
                                    card: elements.getElement(
                                      CardNumberElement
                                    ),
                                    card: elements.getElement(
                                      CardExpiryElement
                                    ),
                                    card: elements.getElement(CardCvcElement),
                                    billing_details: {
                                      name: values.nameOnCard,
                                      address: {
                                        city: values.city,
                                        line1: values.address,
                                        postal_code: values.postal_code,
                                        state: values.state,
                                      },
                                    },
                                  },
                                }
                              );

                              if (payload.error) {
                                console.log("[error]", payload.error);
                              } else {
                                console.log(
                                  "[PaymentIntent]",
                                  payload.paymentIntent
                                );
                                const data = {
                                  intentData: payload.paymentIntent,
                                  appointment_id: "5f4fc34569aef47bbe13b426",
                                };
                                this.props.saveAppointmentPayments(data);
                              }
                            }}
                            render={({
                              values,
                              isSubmitting,
                              setFieldValue,
                            }) => (
                              <Form>
                                <FormGroup className="form-label-group">
                                  <Field
                                    type="text"
                                    placeholder="Name on Card"
                                    name="nameOnCard"
                                    id="name-on-card"
                                    className="form-control"
                                    size="lg"
                                  />
                                </FormGroup>
                                <FormGroup className="form-label-group">
                                  <CardNumberElement
                                    options={{
                                      classes: {
                                        base: "form-control",
                                      },
                                      placeholder: "Card Number",
                                    }}
                                  />
                                  <div className="form-control-position pr-1">
                                    <CreditCard size={22} />
                                  </div>
                                </FormGroup>
                                {/* <FormGroup className="position-relative has-icon-right">
                                  <Input
                                    type="text"
                                    placeholder="Card Number"
                                    name="card-number"
                                    id="card-number"
                                    className="form-control pl-1 pr-4"
                                    size="lg"
                                  />
                                  <div className="form-control-position pr-1">
                                    <CreditCard size={22} />
                                  </div>
                                </FormGroup> */}
                                <Row>
                                  <Col md="8">
                                    <FormGroup>
                                      <CardExpiryElement
                                        options={{
                                          classes: {
                                            base: "form-control",
                                          },
                                          placeholder: "Card Expiry (MM/YY)",
                                        }}
                                      />
                                      {/* <Input
                                        type="text"
                                        placeholder=""
                                        name="card-expiry"
                                        id="card-expiry"
                                        className="form-control"
                                        size="lg"
                                      /> */}
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <CardCvcElement
                                        options={{
                                          classes: {
                                            base: "form-control",
                                          },
                                          placeholder: "CVV",
                                        }}
                                      />
                                      {/* <Input
                                        type="text"
                                        placeholder="CVV"
                                        name="cvv"
                                        id="cvv"
                                        className="form-control"
                                        size="lg"
                                      /> */}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <FormGroup className="form-label-group">
                                  <Field
                                    type="text"
                                    placeholder="Address"
                                    name="address"
                                    id="address"
                                    className="form-control"
                                    size="lg"
                                  />
                                </FormGroup>
                                <FormGroup>
                                  <Field
                                    type="text"
                                    placeholder="City"
                                    name="city"
                                    id="city"
                                    className="form-control"
                                    size="lg"
                                  />
                                </FormGroup>
                                <Row>
                                  <Col md="6">
                                    <FormGroup>
                                      <Field
                                        type="text"
                                        placeholder="State"
                                        name="state"
                                        id="state"
                                        className="form-control"
                                        size="lg"
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col md="6">
                                    <FormGroup>
                                      <Field
                                        type="text"
                                        placeholder="ZIP"
                                        name="postal_code"
                                        id="zip"
                                        className="form-control"
                                        size="lg"
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <div className="d-block ripple pay-btn">
                                  <Button.Ripple
                                    color="primary"
                                    type="submit"
                                    className="btn-block"
                                    size="lg"
                                  >
                                    Make Payment
                                  </Button.Ripple>
                                </div>
                              </Form>
                            )}
                          />
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
        </ElementsConsumer>
      </Elements>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  const { payment } = state;
  return {
    payment: payment.intent,
    appointment_payment_data: payment.appointment_payment_status,
  };
};

export default connect(mapStateToProps, {
  createPaymentIntent,
  saveAppointmentPayments,
})(Payment);
