import React, { Component, Fragment } from "react";
import Card from "./Card";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ConfirmBox from "./ConfirmBox";
import SearchContext from "../SearchContext";
import axios from "axios";
import { Typography } from "@material-ui/core";
import { Route, Link, BrowserRouter } from "react-router-dom";
//import classes from "*.module.css";

// const Data = [
//   {
//     name: "W180",
//     price: "1000",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "W210",
//     price: "900",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "W240",
//     price: "830",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "W320",
//     price: "740",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "S240",
//     price: "810",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "S320",
//     price: "710",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "JK",
//     price: "630",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "S",
//     price: "750",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   },
//   {
//     name: "JH",
//     price: "720",
//     desc: "Pure natural nuts ,contains 180 nuts per kg",
//     image: "/ruh"
//   }
// ];
export default class Home extends Component {
  static contextType = SearchContext;
  constructor() {
    super();
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    // this.fetchProductDetails();
    this.fetchCartData();
  }

  fetchProductDetails = async () => {
    try {
      let { data } = await axios
        .get(`http://localhost:3010/productdetails`)
        .then(res => res);
      this.setState({});
    } catch (err) {
      console.log(err);
    }
  };

  fetchCartData = async () => {
    try {
      let { data } = await axios
        .get(`http://localhost:3010/cart?id=1`)
        .then(res => res);
      this.setState({ data });
    } catch (err) {
      console.log(err);
    }
  };
  addToCard = async name => {
    try {
      let data = await axios
        .get(`http://localhost:3010/add?id=1&product_type=${name}&quantity=1`)
        .then(res => res);
      this.fetchCartData();
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    let { data } = this.state;
    return (
      <Fragment>
        {/* <div className={classes.sectionWrapper}> */}

        {data.length ? (
          <Grid container>
            {data.map(
              item =>
                item.name.includes(this.context.toUpperCase()) && (
                  <Grid item xs={12} sm={6} lg={4}>
                    <Card details={item} addToCard={this.addToCard}></Card>
                  </Grid>
                )
            )}
          </Grid>
        ) : (
          <div align="center">
            <Typography>Nothing to ADD in Cart</Typography>
            <Link to="/cart">go to cart</Link>
          </div>
        )}
      </Fragment>
    );
  }
}
