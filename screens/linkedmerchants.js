import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import firebase from '../firebase'
import { ScrollView } from 'react-native-gesture-handler';
export default class LinkedMerchants  extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading:true,
            merchants:{},
            uid:''
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }

    componentDidMount(){
        this.authsubs = this.auth.onAuthStateChanged(user=>{
            if(user){
                let uid = user.uid
                this.setState({
                    uid:uid
                })
                this.db.ref('linkedmerchants').child(uid).once('value').then(r=>{
                    this.setState({
                        merchants:r.exists()?r.val():{}
                    })
                })
            }
        })
    }
    componentWillUnmount(){
        this.authsubs()
    }
    selectmerch = (name,uid)=>{
        this.props.navigation.navigate('Home',{merchname:name,merchuid:uid})
    }
    render(){
        let styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE'
            },
            header:{
                marginTop:10,
                marginBottom:10
            }
        })
        return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={{alignSelf:'center',fontWeight:'bold'}}>LINKED MERCHANTS</Text>
            </View>
            {!this.state.loading && Object.keys(this.state.merchants).length>0 && Object.keys(this.state.merchants).map(e=>{
                <View style={{marginTop:5,marginBottom:5,marginLeft:20,marginRight:20}}>
                    <Text onPress={()=>this.selectmerch(this.state.merchants[e]['name'],e)} style={{alignSelf:'center',padding:10,backgroundColor:'whitesmoke'}}>
                        {this.state.merchants[e]['name']}
                    </Text>
                </View>
            })}

        </ScrollView>
        )
    }


}