import React from 'react';
import Home from './Components/Home';
import { Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Cart from './Components/Cart';
class Router extends React.Component {
  render() {
    return (
      <Container fixed>
        <Route exact path="/" component={Home}></Route>
        <Route path="/cart" component={Cart}></Route>
      </Container>
    );
  }
}
export default Router;
