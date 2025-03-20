import './App.css'
import {useEffect, useState} from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Components
import Navbar from './components/Navbar'
import SideDrawer from './components/SideDrawer'
import Backdrop from './components/Backdrop'

// Screens
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import SignUp from './screens/SignUp'
import SignIn from './screens/SignIn'
import {useDispatch} from 'react-redux'
import {fetchCart} from './redux/actions/cartActions'
import {setUserDeatils} from './redux/actions/userAction'
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Reviews from "./dashboard/reviews";
import Approved from "./dashboard/approved";
import BadReviews from "./dashboard/badreview";

function App() {
  const [sideToggle, setSideToggle] = useState(false)
  // fetchCart
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchCart())
    dispatch(setUserDeatils())
  }, [dispatch])

  return (
    <Router>
      <Navbar click={() => setSideToggle(true)} />
      <SideDrawer show={sideToggle} click={() => setSideToggle(false)} />
      <Backdrop show={sideToggle} click={() => setSideToggle(false)} />

      <main className="app">
        <Switch>
          
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/reviews" component={Reviews} />
          <Route exact path="/approved" component={Approved} />
          <Route exact path="/flagged" component={BadReviews} />

          <Route exact path="/" component={HomeScreen} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/product/:id" component={ProductScreen} />
          <Route exact path="/cart" component={CartScreen} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/signin" component={SignIn} />
          
        </Switch>
      </main>
    </Router>
  )
}

export default App
