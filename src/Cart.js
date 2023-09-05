import React, { useState } from 'react';
import { useCart } from './CartContext';
import Nav from './Nav';
import { Button, ListGroup, Container, Row, Col, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
export default function Cart() {
    const { cart, removeFromCart, setCart } = useCart();
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '', // Add email field
        address: '',
        deliveryTime: '',
    });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [formErrors, setFormErrors] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        deliveryTime: '',
    });
    const [dis, setDis] = useState({
        msg: '',
        color: 'green',
    });

    const totalCost = cart.reduce((total, item) => {
        return total + item.itemCost * item.quantity;
    }, 0);

    function handlePlaceOrder() {
        if (cart.length === 0) {
            setDis({
                msg: 'Cart is empty',
                color: 'red',
            });

            setTimeout(() => {
                setDis({
                    msg: '',
                    color: 'green',
                });
            }, 2000);
        } else {
            setShowOrderModal(true);
        }
    }

    const handleCloseOrderModal = () => {
        setShowOrderModal(false);
    };

    const handlePlaceOrderModal = () => {
        setFormErrors({
            name: '',
            phone: '',
            email: '', // Reset email field error
            address: '',
            deliveryTime: '',
        });

        let hasError = false;
        if (formData.name.trim() === '') {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name is required',
            }));
            hasError = true;
        }
        if (formData.phone.trim() === '') {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                phone: 'Phone is required',
            }));
            hasError = true;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Email is not valid',
            }));
            hasError = true;
        }
        if (formData.address.trim() === '') {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                address: 'Address is required',
            }));
            hasError = true;
        }
        if (formData.deliveryTime.trim() === '') {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                deliveryTime: 'Delivery time is required',
            }));
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const orderData = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            deliveryTime: formData.deliveryTime,
            cart: cart, // Include the cart data
        };
        setLoading(true);
        // Make a POST request to your server to place the order
        axios.post('http://localhost:5000/place-order', orderData)
            .then((response) => {
                // Handle the success response here
                console.log('Order placed successfully:', response.data);
                setCart([]);
                setOrderPlaced(true);
                setShowOrderModal(false);
                setFormData({
                    name: '',
                    phone: '',
                    email: '', // Clear email field
                    address: '',
                    deliveryTime: '',
                });
            })
            .catch((error) => {
                // Handle any errors that occur during the POST request
                console.error('Error placing order:', error);
                // You can display an error message to the user if needed
            })
            .finally(() => {
                setLoading(false); // Enable the button again
            });

    }


    return (
        <div>
            <Nav />

            {orderPlaced && (
                <Alert variant="success" className="mt-3">
                    Order placed successfully! You'll get an email about your order.
                </Alert>
            )}
            <Container>
                <h1 style={{textAlign:'center'}}>Cart</h1>
                <span style={{ ...dis, display: dis.msg ? 'block' : 'none' }}>{dis.msg}</span>
                <ListGroup>
                    {cart.map((item) => (
                        <ListGroup.Item key={item.itemName}>
                            <Row>
                                <Col md={3}>
                                    <img src={`data:image/jpeg;base64,${item.itemImage}`} alt={item.itemName} width="100" height="100" />
                                </Col>
                                <Col md={3}>
                                    {item.itemName} -{' '}
                                    {item.quantity > 0 ? `Quantity: ${item.quantity}` : ''}
                                </Col>
                                <Col md={3}>
                                    Price: {item.itemCost}
                                </Col>
                                <Col md={3}>
                                    Cost: {item.itemCost * item.quantity}
                                </Col>
                                <Col md={3}>
                                    <Button
                                        variant="danger"
                                        onClick={() => removeFromCart(item)}
                                        style={{marginTop:'10px'}}
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className="mt-3">
                    <h4>Total Cost: {totalCost}</h4>
                </div>
                <div className="mt-3">
                    <Button variant="primary" onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                </div>
            </Container>

            <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Your Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                            <Form.Text className="text-danger">
                                {formErrors.name}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                            />
                            <Form.Text className="text-danger">
                                {formErrors.phone}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email"> {/* Add email field */}
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            <Form.Text className="text-danger">
                                {formErrors.email}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                            />
                            <Form.Text className="text-danger">
                                {formErrors.address}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="deliveryTime">
                            <Form.Label>Time of Delivery</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter delivery time"
                                value={formData.deliveryTime}
                                onChange={(e) =>
                                    setFormData({ ...formData, deliveryTime: e.target.value })
                                }
                            />
                            <Form.Text className="text-danger">
                                {formErrors.deliveryTime}
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrderModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePlaceOrderModal} disabled={loading}>
                        Place Order
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
