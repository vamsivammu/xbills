import React from 'react'
import {View,Text,StyleSheet,ActivityIndicator} from 'react-native'
import firebase from '../firebase'
export default class Loader extends React.Component{

    constructor(props){
        super(props)
        this.auth = firebase.auth()
        this.db = firebase.database()
        this.authsubs = this.auth.onAuthStateChanged(user=>{
            if(user){
                
                try{
                    this.db.ref('xbillsusers').child(user.uid).child('data').once('value',r=>{
                        let data = r.val()
                        if(data!=null && data!=undefined){
                            this.authsubs()
                            this.props.navigation.navigate('Home')
                        }else{
                            this.authsubs()
                            this.props.navigation.navigate('Login')
                        }
                    })
                }catch(e){
                    this.authsubs()
                    this.props.navigation.navigate('Login')
                }
            }else{
                this.authsubs()
                this.props.navigation.navigate('Login')
            }
        })
    }
    componentWillUnmount(){
        this.authsubs()
    }
    render(){
        const styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE',
                justifyContent:'center'
            }
        })
        return(
            <View style={styles.container}>
                <ActivityIndicator color="blue" size="large"></ActivityIndicator>
            </View>
        )

    }

}
