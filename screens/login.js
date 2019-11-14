import React from 'react'
import firebase from '../firebase'
import {NavigationEvents} from 'react-navigation'

import {Text,View,StyleSheet,TextInput,Button,ButtonProperties,ActivityIndicator,BackHandler,Alert} from 'react-native'
export default class Login extends React.Component{
    constructor(props){
        super(props)  
        this.state = {
            email:'',
            password:'',
            loading:false
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }
    componentDidMount(){

    }
    componentWillUnmount(){
        this.backhandler.remove()
    }
    login=()=>{
        this.setState({
            loading:true
        })
        this.auth.signInWithEmailAndPassword(this.state.email,this.state.password).then(r=>{
            let uid = r.user.uid
            this.backhandler.remove()
            this.props.navigation.navigate('Home')
        }).catch(e=>{
            alert(e.code)
        })
    }
    changeemail = (t)=>{
        this.setState({
            email:t
        })
    }
    changepass = (t)=>{
        this.setState({
            password:t
        })
    }
    render(){
        let styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE',
                alignItems:'center',
                justifyContent:'center'
            },
            inputfield:{
                marginTop:7,
                marginBottom:7,
                height:35,
                width:'60%'
            },
            mobile:{
                borderColor:'black',
                borderWidth:1,
                height:35,
                borderRadius:25,
                fontSize:10,
                marginRight:20,
                marginLeft:20
            },
            buttoncontainer:{
                marginTop:5,
                
            },
            button:{
                fontSize:10,
                marginTop:10,
                
            }
        })

        return(
            <View style = {styles.container}>
                <NavigationEvents
            onDidBlur={(r)=>{this.backhandler.remove()}}
            onDidFocus = {()=>{
                this.backhandler = BackHandler.addEventListener('hardwareBackPress',(e)=>{
                    console.log('pressed back')
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
                <View style={{marginBottom:7}}>
                    <Text style={{fontWeight:'bold',fontSize:25}}>Login</Text>
                </View>
                <View style={styles.inputfield}>
                    <TextInput style={styles.mobile} onChangeText={t=>this.changeemail(t)} placeholder="Email"></TextInput>
                </View>
                <View style={styles.inputfield}>
                    <TextInput placeholder="Password" secureTextEntry={true} style={styles.mobile} onChangeText={t=>this.changepass(t)}></TextInput>
                </View>
                <View style={styles.buttoncontainer}>
                    <Button title="Sign In" onPress={this.login} color="turquoise" style={styles.button}></Button>
                </View>
                <View style={{marginBottom:7}}>
                    <Text >Don't have an account? <Text onPress={()=>{this.props.navigation.navigate('SignUp')}} style={{fontWeight:'bold',fontSize:18,color:'skyblue'}}>Sign Up</Text></Text>
                </View>
                {this.state.loading && <ActivityIndicator size="large" color="blue"></ActivityIndicator>}
            </View>
        )
    }
}