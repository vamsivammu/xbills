import React from 'react'
import {Text,View,StyleSheet,Image,BackHandler,Dimensions} from 'react-native'
import firebase from '../firebase'
import {NavigationEvents} from 'react-navigation'
export default class BillView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            pic:'',
            name:'',
            category:'',
            amount:'',
            date:'',
            uid:'',
            loading:true
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }
    componentDidMount(){
        this.authsubs = this.auth.onAuthStateChanged(user=>{
            if(user){
                this.setState({
                    uid:user.uid
                })
            }else{
                this.props.navigation.navigate('Login')
            }
        })
        this.setState({
            pic:this.props.navigation.getParam('billpic',''),
            category:this.props.navigation.getParam('category', ''),
            name:this.props.navigation.getParam('merchname',''),
            amount:this.props.navigation.getParam('amount',''),
            date:this.props.navigation.getParam('date',''),
            loading:false
        })
    }
    render(){
        let styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE'
            },
            details:{
                display:'flex',
                flexDirection:'row',
                marginTop:10,
                justifyContent:'space-evenly'
            }
        })
        return(
            <View style={styles.container}>

                    {
                        !this.state.loading &&
                            <View style={{width:'100%',height:'90%',justifyContent:'center',alignItems:'center'}}> 
                                <Image resizeMode="contain" style={{width:'100%',height:'100%',alignSelf:'center'}}  source={{uri:this.state.pic}} />
                            </View>
                    }

{!this.state.loading && <View style={styles.details}>
                    <Text>
                        {this.state.name}
                    </Text>

                    <Text>
                        {this.state.date}
                    </Text>

                    <Text>
                        {this.state.category}
                    </Text>

                    <Text>
                        {this.state.amount}
                    </Text>
                </View>}
            </View>
        )
    }
}