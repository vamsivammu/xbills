/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import ScanPage from './screens/scanpage'
import AllBills from './screens/allbills'
import Loader from './screens/loader'
import Home from './screens/home'
import Login from './screens/login'
import SignUp from './screens/signup'
import MyData from './screens/mydata'
import AnnualBills from './screens/annualbills'
import MonthBills from './screens/monthbills'
import AddBill from './screens/addbill'
import BillView from './screens/billview'
import LinkedMerchants from './screens/linkedmerchants'
import {createAppContainer,createStackNavigator} from 'react-navigation'

export default class App extends Component{
  constructor(props){
    super(props)
  }
  render() {

    const stacknavigator = createStackNavigator({
      Home:Home,
      AllBills:AllBills,
      Loader:Loader,
      ScanPage:ScanPage,
      Login:Login,
      SignUp:SignUp,
      MyData:MyData,
      BillView:BillView,
      AnnualBills:AnnualBills,
      MonthBills:MonthBills,
      AddBill:AddBill,
      LinkedMerchants:LinkedMerchants
    },{initialRouteName:'Login',headerMode:'none'})
    const AppContainer = createAppContainer(stacknavigator)
    return <AppContainer />
  }
}
