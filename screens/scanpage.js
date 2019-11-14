import React from 'react'
import {View,Text,StyleSheet,Alert,BackHandler} from 'react-native'
import {RNCamera} from 'react-native-camera'
// import console = require('console');
import firebase from '../firebase'
import {NavigationEvents} from 'react-navigation'
let inst
export default class ScanPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            name:'name',
            loading:false
        }
        inst = this
        this.db = firebase.database()
        this.auth = firebase.auth()
    }
    componentDidMount(){
        console.log("in camera")
        
    }
    componentWillUnmount(){
        console.log("unmounteeeed")
    }
    parsedata = (e)=>{
        if(!this.state.loading){
            
            let data = JSON.parse(e.data)
            if(data.type =="Merchant"){
                this.setState({loading:true})
                this.authsubs = this.auth.onAuthStateChanged(user=>{
                    if(user){
                        let uid = user.uid
                        this.db.ref('linkedmerchants').child(uid).set({'name':data.name,'merchuid':data.uid}).then(()=>{
                            this.props.navigation.navigate('Home',{merchname:data.name,merchuid:data.uid})
                        })
                    }
                })
                
            }else if(data.type=="Customer"){
                this.setState({loading:true})
            }
        }

    }

    render(){

        const styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'turquoise',
                flexDirection:'column'
            },
            header:{
                alignSelf:'center',
                marginTop:20,
                marginBottom:30
            }
        })

        return(
            <View style={styles.container}>
                {/* <View style={styles.header}>
                   <Text> MY MOBILE QR CODE </Text>
                </View> */}
               {/* <NavigationEvents
            onDidBlur={(r)=>{this.backhandler.remove()}}
            onDidFocus = {()=>{
                this.backhandler = BackHandler.addEventListener('hardwareBackPress',(e)=>{
                    console.log('pressed back')
                    this.props.navigation.goBack()
                    return true    
                })
            }}
            /> */}
                <RNCamera
                    ref={r=>this.camera=r}
                    style={{
                        width:'100%',
                        height:'100%'
                    }}
                    onBarCodeRead={e=>this.parsedata(e)}
                />
                

            </View>
        )

    }

}
