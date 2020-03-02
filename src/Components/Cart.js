import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
import { TextField, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ConfirmBox from "./ConfirmBox";
import { cloneDeep } from "lodash";
import axios from "axios";
import cart from "../cart";
import Icon from "@material-ui/core/Icon";
import { comma } from "./common/CommonFunction";
const prices = { w180: 1000, w240: 900, w180: 850, jk: 640 };
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  }
}));
const Paper1 = props => {
  const classes = useStyles();
  return <Paper className={classes.paper}>{props.children}</Paper>;
};
export default class Cart extends Component {
  constructor() {
    super();
    this.state = {
      amt: 0,
      open: false,
      cartData: [],
      update: false,
      loadedCartData: [],
      productDetails: [],
      errorData: {}
    };
  }
  componentDidMount = async () => {
    await this.fetchProductDetails();
    this.fetchCartItem();
  };

  fetchProductDetails = async () => {
    try {
      let { data } = await axios
        .get(`http://localhost:3010/productdetails`)
        .then(res => res);
      this.setState({ productDetails: data });
    } catch (err) {
      console.log(err);
    }
  };

  fetchCartItem = async () => {
    let { productDetails } = this.state;
    let { data } = await axios
      .get("http://localhost:3010/cartitem?id=1")
      .then(res => res);
    let cartData = cloneDeep(data);
    let loadedCartData = cloneDeep(data);

    let Total_ammount = cartData.reduce((amt, item, index) => {
      let ob = _.find(productDetails, { name: item.product_type });
      return (amt = amt + Number(ob.price) * Number(item.qauntity));
    }, 0);
    this.setState({
      cartData,
      loadedCartData,
      update: false,
      amt: Total_ammount
    });
  };
  openPopUp = () => {
    this.setState({ open: true });
  };
  close = () => {
    this.setState({ open: false });
    this.fetchCartItem();
  };
  removeFromCart = async name => {
    let { errorData } = this.state;
    try {
      let { data } = await axios
        .get(`http://localhost:3010/removecartitem?id=1&name=${name}`)
        .then(res => res);
      if (errorData[name]) delete errorData[name];
      this.setState({ errorData }, this.fetchCartItem);
    } catch (err) {
      console.log(err);
    }
  };
  checkEquality = () => {
    let { loadedCartData, cartData, update, errorData } = this.state;
    if (
      !!cartData.filter(i => {
        if (!_.find(loadedCartData, i)) {
          return 1;
        }
      }).length
    )
      update = true;
    else update = false;
    if (
      !!Object.values(errorData).filter(item => {
        if (item) return item;
      }).length
    ) {
      update = false;
    }
    this.setState({ update });
  };
  checkForError = () => {
    let { errorData } = this.state;
    if (
      !!Object.values(errorData).filter(item => {
        if (item) return item;
      }).length
    ) {
      return false;
    }
    return true;
  };
  changeCartValue = (e, product_type) => {
    let { cartData, errorData, loadedCartData } = this.state;
    cartData = cartData.map(item => {
      if (item.product_type === product_type) {
        item.qauntity = e.target.value;
        return item;
      }
      return item;
    });
    this.setState({ cartData });
    if (e.target.value < 0.5) {
      errorData[product_type] = "Minimum quantity should be more than 0.5kg";
      this.setState({ errorData });
    } else {
      if (errorData[product_type]) delete errorData[product_type];
    }
    this.checkEquality();
  };

  updateCart = async () => {
    let { cartData } = this.state;
    let updatedCartData = cartData.filter(item => {
      if (item.qauntity !== 1) return item;
    });
    let data = await axios
      .post(`http://localhost:3010/updatecart`, {
        data: updatedCartData
      })
      .then(res => res);
    this.fetchCartItem();
  };

  handleChange = e => this.setState({ amt: e.target.value });
  render() {
    let { open, cartData, update, productDetails, errorData, amt } = this.state;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper1>
            <h1 align="center">CART DETAILS</h1>
            {!!cartData.length &&
              cartData.map(element => {
                let { price } = _.find(productDetails, {
                  name: element.product_type
                });
                return (
                  <div>
                    <Paper1>
                      <h3 align="center">
                        CASHEW-TYPE : {element.product_type}
                      </h3>
                      <Grid item xs={12}>
                        <TextField
                          id="outlined-full-width"
                          label="Quantity in KG"
                          style={{ margin: 8 }}
                          placeholder="0.000"
                          error={!!errorData[element.product_type]}
                          helperText={errorData[element.product_type] || ""}
                          onChange={e =>
                            this.changeCartValue(e, element.product_type)
                          }
                          type="Number"
                          margin="normal"
                          value={element.qauntity || ""}
                          InputLabelProps={{
                            shrink: true
                          }}
                          variant="outlined"
                        />
                        {/* <InputLabel htmlFor="age-native-helper">
                    Quantity in Grams{" "}
                  </InputLabel>
                  <NativeSelect
                    value={this.state.amt}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "age",
                      id: "age-native-helper"
                    }}
                  >
                    <option value={0.0}>0.00</option>
                    <option value={0.25}>0.25</option>
                    <option value={0.5}>0.50</option>
                    <option value={0.75}>0.75</option>
                  </NativeSelect>
                  <Typography> AMT: 100</Typography> */}
                        {/* <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={() =>
                          this.removeFromCart(element.product_type)
                        }
                      ></Button> */}
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            this.removeFromCart(element.product_type)
                          }
                        >
                          <DeleteIcon fontSize="large" />
                        </IconButton>
                        <h4>PRICE /kg :{price} ₹</h4>
                        <h5>
                          COST :{" "}
                          {comma(
                            (Number(price) * Number(element.qauntity)).toFixed(
                              3
                            )
                          )}{" "}
                          ₹
                        </h5>
                      </Grid>
                    </Paper1>
                    <br></br>
                  </div>
                );
              })}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={this.updateCart}
              disabled={!update}
            >
              UPDATE
            </Button>
          </Paper1>
        </Grid>
        <Grid xs={12} sm={3}>
          <Typography>Total amt : {amt && comma(amt.toFixed(3))} ₹</Typography>

          <div>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              disabled={
                !cartData.length || update || Object.values(errorData).length
              }
            >
              Buy Now
            </Button>
            <span>&nbsp;</span>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={this.openPopUp}
            >
              Add More To Cart
            </Button>
          </div>
        </Grid>
        {open && (
          <ConfirmBox
            open={this.state.open}
            handleClose={this.close}
          ></ConfirmBox>
        )}
      </Grid>
    );
  }
}
