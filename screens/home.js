import React from 'react'
import {View,Text,StyleSheet,BackHandler,Alert} from 'react-native'
import {NavigationEvents} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'
export default class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            merchantname : this.props.navigation.getParam('merchname','SEARCH BY LINKED MERCHANT NAME'),
            merchuid:this.props.navigation.getParam('merchuid','none')
        }

    }
    gotomydata = ()=>{

    }
    gotoscanpage = ()=>{

    }
    gotobillspage = ()=>{

    }
    gotoannualpage = ()=>{

    }
    gotomerchantspage = ()=>{

    }
    addbill = ()=>{
        this.backhandler.remove()
        this.props.navigation.navigate('AddBill')
    }

    render(){
        const styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE',
                justifyContent:'space-between'
                
            },
            header:{
                marginTop:20,
                marginBottom:20
            },
            icons:{
                display:'flex',
                flexDirection:'row',
                justifyContent:'center',
                marginTop:10,
                marginBottom:10
            },
            icon:{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center'
            }
        })
        return(
        <View style={styles.container}>
            <NavigationEvents
            onDidBlur={(r)=>{this.backhandler.remove()}}
            onDidFocus = {()=>{
                this.backhandler = BackHandler.addEventListener('hardwareBackPress',(e)=>{
                    // console.log('pressed back')
                    Alert.alert(
                        'Exit App?',
                        'Do you want to quit the application',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {text: 'Yes', onPress: () => BackHandler.exitApp()},
                        ],
                        {cancelable: true},
                      );
                return true
                    })
            }}
            />
            <View>
                <View style={styles.header}>
                    <Text onPress={()=>{
                        this.backhandler.remove()
                        this.props.navigation.navigate('MyData')
                }} style={{alignSelf:'center',borderBottomColor:'black',borderBottomWidth:2}} >My QR Code</Text>
                </View>

                <View style={styles.header}>
                    <Text style={{alignSelf:'center'}}>TAP <Text onPress={()=>{
                        this.backhandler.remove()
                        this.props.navigation.navigate('ScanPage')
                        }} style={{color:'skyblue'}}>HERE</Text> TO GET EBILLS FROM RETAILER</Text>
                </View>
            </View>
            <View>                
                <View style={styles.header}>
                    <Text onPress={()=>this.props.navigation.navigate('LinkedMerchants')} style={{alignSelf:'center',backgroundColor:'whitesmoke',padding:10}}>{this.state.merchantname}</Text>
                </View>
                <View style={styles.header}>
                    <Text onPress={()=>{
                        this.backhandler.remove()
                        this.props.navigation.navigate('AnnualBills')
                    }} style={{alignSelf:'center',backgroundColor:'whitesmoke',padding:10}}>EXPENSE SUMMARY(ANNUALLY)</Text>
                </View>
                <View style={styles.header}>
                    <Text onPress={()=>{
                        this.backhandler.remove()
                        this.props.navigation.navigate('AllBills')
                }} style={{alignSelf:'center',backgroundColor:'whitesmoke',padding:10}}>VIEW ALL BILLS</Text>
                </View>
            </View>
            <View style={styles.icons}>
                <View onTouchEnd={this.addbill} style={styles.icon}>
                    <Icon name="plus" size={20}></Icon>
                    <Text>Add Bill</Text>
                </View>

            </View>
        </View>
        )

    }

}
