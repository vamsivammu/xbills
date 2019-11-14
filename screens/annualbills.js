import React from 'react'
import {Text,View,StyleSheet,ActivityIndicator,BackHandler,Dimensions} from 'react-native'
import {NavigationEvents} from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler';
import firebase from '../firebase'
export default class AnnualBills extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            bills:{},
            annualexpenses:{},
            uid:''
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }
    componentDidMount(){
        this.authsubs = this.auth.onAuthStateChanged(user=>{
            if(user){
                let uid = user.uid
                this.db.ref('xbills').child(uid).once('value',r=>{
                    let data = r.exists()?r.val():{}
                    this.db.ref('annualexpenses').child(uid).once('value',r1=>{
                        let data2 = r1.exists()?r1.val():{}
                        this.setState({
                            bills:data,
                            uid:uid,
                            annualexpenses:data2,
                            loading:false
                        })
                    })

                })
            }else{
                this.props.navigation.navigate('Login')
            }
        })
    }

    openmonth = (month,year)=>{
        // alert(month)
        this.props.navigation.navigate('MonthBills',{month:month,year:year,bills:this.state.bills[year.toString()][month]})
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
            },
            headertext:{
                alignSelf:'center'
            },
            yeartext:{
                fontWeight:'bold',
                alignSelf:'center'
            },
            billtext:{
                fontWeight:'bold',
                fontSize:20
            },
            bill:{
                display:'flex',
                backgroundColor:'whitesmoke',
                padding:10,
                marginLeft:20,
                marginRight:20,
                marginTop:5,
                marginBottom:5,
                flexDirection:'row',
                justifyContent:'space-between'
            }
        })
        return(
            <ScrollView style={styles.container}>
                {/* <NavigationEvents
                    onDidBlur={()=>{this.backhandler.remove()}}
                    onDidFocus = {()=>{
                        this.backhandler = BackHandler.addEventListener('hardwareBackPress',()=>{
                            // console.log("pressed from annual")
                            this.backhandler.remove()
                            this.props.navigation.navigate('Home')
                            return true
                        })
                    }}
                /> */}
                <View style={styles.header}>
                    <Text style={styles.headertext}>ANNUAL BILLS</Text>
                </View>
                {!this.state.loading && Object.keys(this.state.bills).length>0 && Object.keys(this.state.annualexpenses).length>0 && Object.keys(this.state.bills).map(e=>{
                   return(
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.yeartext}>{e}</Text>
                        </View>
                        {Object.keys(this.state.annualexpenses[e]).map(e1=>{
                            return(
                                <View style={styles.bill} onTouchEnd={()=>this.openmonth(e1,e)}>
                                    <Text style={styles.billtext}>{e1} {e}</Text>
                                    <Text style={styles.billtext}>{this.state.annualexpenses[e][e1]['amount']}</Text>
                                </View>
                            )
                        })}
                    </View>
                   )     


                })}

                {
                this.state.loading && <View style={{position:'absolute',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                            <ActivityIndicator size="large" color="blue" />
                    </View>
                }

                
            </ScrollView>
        )
    }
}