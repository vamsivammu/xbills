import React from 'react'
import {Text,View,StyleSheet,ActivityIndicator,BackHandler} from 'react-native'
import firebase from '../firebase'
import QRCode from 'react-native-qrcode'
export default class MyData extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            name:'',
            uid:'',
            mobile:'',
            email:'',
            type:''
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }
    componentDidMount(){
        this.authsubs = this.auth.onAuthStateChanged(user=>{
            if(user){
                let uid = user.uid
                try{
                    this.db.ref('xbillsusers').child(uid).child('data').once('value',r=>{
                        let data = r.val()
                        if(data!=null && data!=undefined){
                            this.setState({
                                name:data['name'],
                                mobile:data['mobile'],
                                email:data['email'],
                                uid:uid,
                                type:data['type'],
                                loading:false
                            })
                        }else{
                            this.props.navigation.navigate('Login')
                        }
    
                    })
                }catch(e){
                    this.props.navigation.navigate('Login')
                }

            }else{
                alert('Please login again')
                this.props.navigation.navigate('Login')
            }
        })
        // this.backhandler = BackHandler.addEventListener('hardwareBackPress',()=>{
        //     this.props.navigation.goBack()
        // })
    }
    render(){
        let styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE',
                justifyContent:'space-evenly'
            },
            header:{
                marginTop:20,
                marginBottom:20
            },
            qr:{
                marginTop:20,
                marginBottom:20,
                display:'flex',
                flexDirection:'row',
                justifyContent:'center'
            }
        })
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{alignSelf:'center'}}>MY QR CODE</Text>
                </View>
                {!this.state.loading && <View style={styles.qr}>
                    <QRCode 
                        value={JSON.stringify({
                            virtualid:this.state.uid,
                            type:this.state.type
                        })}
                        size={600}
                        fgColor='#AFEEEE'
                    />
                </View>}
                {!this.state.loading && <View>                
                    <View style={styles.header}>
                        <Text style={{alignSelf:'center',backgroundColor:'whitesmoke',padding:10}}><Text style={{fontWeight:'bold'}}>NAME: </Text>{this.state.name}</Text>
                    </View>
                    <View style={styles.header}>
                        <Text style={{alignSelf:'center',backgroundColor:'whitesmoke',padding:10}}><Text style={{fontWeight:'bold'}}>MOBILE: </Text>{this.state.mobile}</Text>
                    </View>
                    <View style={styles.header}>
                        <Text style={{alignSelf:'center',backgroundColor:'whitesmoke',padding:10}}><Text style={{fontWeight:'bold'}}>EMAIL: </Text>{this.state.email}</Text>
                    </View>
                    <View style={styles.header}>
                    <Text style={{alignSelf:'center',color:'white',backgroundColor:'darkblue',padding:10}}><Text style={{fontWeight:'bold'}}>VIRTUAL ID: </Text>{this.state.uid}</Text>
                    </View>
                </View>}
                {this.state.loading && <ActivityIndicator size="large" color="blue"></ActivityIndicator>}
            </View>
        )
    }

}