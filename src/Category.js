import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Container, CircularProgress } from '@mui/material';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Nav from './Nav';

const CardContainer = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const Image = styled('img')({
  width: '100%',
  maxWidth: '150px',
  height: 'auto',
});

const useStyles = {
  root: {
    flexGrow: 1,
  },
};

function Category() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [redirect, setRedirect] = useState({
    loc: "",
    val: false,
  });

  useEffect(() => {
    // Fetch categories data from your API or backend here
    // Replace this with your actual API endpoint
    console.log('inside category')
    fetch('https://igneous-gamma-398113.el.r.appspot.com/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false); // Set loading to false when there's an error
      });
  }, []);

  function change(event) {
    const selectedCategory = event.target.getAttribute("data-category");
    setRedirect((prev) => ({ ...prev, loc: selectedCategory, val: selectedCategory }));
  }

  return (
    <div>
      <Nav />
      {redirect.val && <Navigate to={`/add/${redirect.loc}`} />}
      {location.pathname === '/' ? (
        <Container>
          <h1 style={{ textAlign: 'center' }}>Categories</h1>
          {loading ? (
            // Display a loading indicator while data is being fetched
            <CircularProgress />
          ) : (
            <div style={useStyles.root}>
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={category._id} onClick={change} data-category={category._id}>
                    <CardContainer>
                      <Image src={`data:image/jpeg;base64,${category.categoryImage}`} alt={category._id} style={{ width: "200px", height: "150px" }} onClick={change} data-category={category._id} />
                      <CardContent>
                        <Typography variant="h5" onClick={change} data-category={category._id}>{category._id}</Typography>
                      </CardContent>
                    </CardContainer>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </Container>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Category;
