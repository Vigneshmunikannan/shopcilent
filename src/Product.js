import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from './CartContext'; // Import useCart from CartContext
import Nav from './Nav';

function Product() {
    const { category } = useParams();
    const [items, setItems] = useState([]);
    const { addToCart } = useCart(); // Use useCart hook
    const [quantity, setQuantity] = useState({});
    const [dis, setDis] = useState({});
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        axios
            .get(`https://igneous-gamma-398113.el.r.appspot.com/item/${category}`)
            .then((response) => {
                setItems(response.data);
                const initialDis = {};
                response.data.forEach((item) => {
                    initialDis[item.itemName] = {
                        msg: '',
                        color: '',
                        display: 'none',
                    };
                });
                setDis(initialDis);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
                setLoading(false); // Set loading to false on error
            });
    }, [category]);

    const handleAddToCart = (item) => {
        if (quantity[item.itemName] === undefined) {
            setDis((prevDis) => ({
                ...prevDis,
                [item.itemName]: {
                    msg: 'Enter Quantity',
                    color: 'red',
                    display: 'block',
                },
            }));

            setTimeout(() => {
                setDis((prevDis) => ({
                    ...prevDis,
                    [item.itemName]: {
                        ...prevDis[item.itemName],
                        display: 'none',
                    },
                }));
            }, 2000);

            console.log('wrong quantity');
            return;
        }
        addToCart(item, quantity[item.itemName]);
    };

    return (
        <div>
            <Nav />
            <Container>
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{ textAlign: 'center', marginTop: '10px' }}
                >
                    {category}
                </Typography>
                {loading ? ( // Display loading indicator
                    <div>Loading...</div>
                ) : (
                    <Grid container spacing={3}>
                        {items.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.itemName}>
                                <Paper elevation={3}>
                                    <img
                                        src={`data:image/jpeg;base64,${item.itemImage}`}
                                        alt={item.itemName}
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            borderRadius: '10px',
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        style={{ marginLeft: '5px' }}
                                    >
                                        {item.itemName}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        gutterBottom
                                        style={{ marginLeft: '5px' }}
                                    >
                                        Price: {item.itemCost}
                                    </Typography>
                                    <span style={dis[item.itemName]}>
                                        {dis[item.itemName].msg}
                                    </span>
                                    <TextField
                                        style={{ margin: '10px 10px' }}
                                        type="number"
                                        label="Quantity"
                                        onChange={(e) => {
                                            setQuantity((prevQuantity) => ({
                                                ...prevQuantity,
                                                [item.itemName]: Number(e.target.value),
                                            }));
                                        }}
                                        value={quantity[item.itemName] || ''}
                                        InputProps={{
                                            endAdornment: (
                                                <Button
                                                    style={{
                                                        border: 'none',
                                                        marginRight: '-13px',
                                                        padding: '7px 7px',
                                                    }}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleAddToCart(item)}
                                                    startIcon={<AddShoppingCartIcon />}
                                                >
                                                    Add to Cart
                                                </Button>
                                            ),
                                        }}
                                    />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </div>
    );
}

export default Product;
