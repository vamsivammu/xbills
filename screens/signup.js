import React from 'react'
import firebase from '../firebase'
import {Text,View,StyleSheet,TextInput,Button,ButtonProperties,ActivityIndicator,Picker} from 'react-native'
export default class SignUp extends React.Component{
    constructor(props){
        super(props)  
        this.state = {
            email:'',
            password:'',
            loading:false,
            name:'',
            mobile:'',
            type:'Merchant'
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }

    signup=()=>{
        this.setState({
            loading:true
        })
        if(this.verifymob() && this.verifyname()){
            this.auth.createUserWithEmailAndPassword(this.state.email,this.state.password).then(r=>{
                let uid = r.user.uid
                this.db.ref('xbillsusers').child(uid).child('data').set({'name':this.state.name,'email':this.state.email,'mobile':this.state.mobile,'type':this.state.type}).then(()=>{
                    this.props.navigation.navigate("Login")
                })
    
            }).catch(e=>{
                alert(e.code)
                this.setState({loading:false})
            })
        }else{
            if(!this.verifymob()){
                alert("Invalid Mobile Number")
            }
            if(!this.verifyname()){
                alert("Invalid Name")
            }
        }

    }
    changeemail = (t)=>{
        this.setState({
            email:t
        })
    }
    changename = (t)=>{
        this.setState({
            name:t
        })
    }
    changemob = (t)=>{
        this.setState({
            mobile:t
        })
    }
    changepass = (t)=>{
        this.setState({
            password:t
        })
    }
    verifymob = ()=>{
        let mobpatt = /^[0-9]{10,10}$/
        if(this.state.mobile.match(mobpatt)){
            return true
        }else{
            return false
        }
    }
    verifyname =()=>{
        if(this.state.name=='' || this.state.name==undefined || this.state.name==null){
            return false
        }else{
            return true
        }
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
                <View style={{marginBottom:7}}>
                    <Text style={{fontWeight:'bold',fontSize:25}}>Sign Up</Text>
                </View>
                <View style={styles.inputfield}>
                    <TextInput style={styles.mobile} onChangeText={t=>this.changename(t)} placeholder="Name"></TextInput>
                </View>
                <View style={styles.inputfield}>
                    <TextInput style={styles.mobile} onChangeText={t=>this.changeemail(t)} placeholder="Email"></TextInput>
                </View>
                <View style={styles.inputfield}>
                    <TextInput style={styles.mobile} onChangeText={t=>this.changemob(t)} placeholder="Mobile"></TextInput>
                </View>
                <View style={styles.inputfield}>
                    <TextInput placeholder="Password" secureTextEntry={true} style={styles.mobile} onChangeText={t=>this.changepass(t)}></TextInput>
                </View>
                <View style={styles.inputfield}>
                        <Picker
                            selectedValue={this.state.type}
                            style={{width: '100%'}}
                            // placeholder="feet"
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({type: itemValue})
                            }>
                            <Picker.Item label="Merchant" value='Merchant' />
                            <Picker.Item label="Customer" value='Customer' />
                        </Picker>
                </View>
                <View style={styles.buttoncontainer}>
                    <Button title="Sign Up" onPress={this.signup} color="turquoise" disabled={this.state.loading} style={styles.button}></Button>
                </View>
                <View style={{marginBottom:7}}>
                    <Text >Already have an account? <Text onPress={()=>{this.props.navigation.navigate('Login')}} style={{fontWeight:'bold',fontSize:18,color:'skyblue'}}>Sign In</Text></Text>
                </View>
                {this.state.loading && <ActivityIndicator size="large" color="blue"></ActivityIndicator>}
            </View>
        )
    }
}