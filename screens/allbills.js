import React from 'react'
import {Text,View,StyleSheet,BackHandler,ActivityIndicator} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import firebase from '../firebase'
export default class AllBills extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            allbills:{},
            numbills:-1,
            loading:true,
            loaded:false
        }
        this.auth = firebase.auth()
        this.db = firebase.database()
    }
    openbill(bill,amount,category,date,merchname){
        this.props.navigation.navigate('BillView',{billpic:bill,category:category,date:date,amount:amount,merchname:merchname})
    }
    componentDidMount(){
        this.authsubs = this.auth.onAuthStateChanged(user=>{
            if(user){
                this.db.ref('xbills').child(user.uid).once('value').then(r=>{
                    this.db.ref('numbills').child(user.uid).once('value').then(r1=>{
                        this.setState({
                            allbills:r.exists()?r.val():{},
                            numbills:r1.exists()?parseInt(r1.val()['num']):0,
                            loading:false
                        })
                    })
                })
            }else{

            }
        })
    }
    componentWillUnmount(){
        this.authsubs()
    }
    loaded = ()=>{
        if(!this.state.loaded){
            this.setState({
                loaded:true
            })
        }

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
            bill:{
                display:'flex',
                flexDirection:'row',
                marginLeft:5,
                marginRight:5,
                marginTop:5,
                marginBottom:5,
                padding:10,
                backgroundColor:'whitesmoke',
            },
            billfield:{
                display:'flex',
                flex:3,
                flexDirection:'column'
            },
            billindex:{
                flex:1
            },
            billamount:{
                flex:1
            }
        })
        let num=0
        return(
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={{alignSelf:'center',fontWeight:'bold'}}>ALL BILLS</Text>
                </View>
                {!this.state.loading && Object.keys(this.state.allbills).length>0 && Object.keys(this.state.allbills).map(year=>{
                    if(Object.keys(this.state.allbills[year]).length>0){
                        return Object.keys(this.state.allbills[year]).map(month=>{
                            if(Object.keys(this.state.allbills[year][month]).length>0){    
                                return Object.keys(this.state.allbills[year][month]).map(date=>{
                                    if(Object.keys(this.state.allbills[year][month][date]).length>0){
                                        return Object.keys(this.state.allbills[year][month][date]).map(bill=>{
                                            num=num+1
                                            if(num==parseInt(this.state.numbills)){
                                                 this.loaded() 

                                                }
                                            return(
                                                <View onTouchEnd={()=>this.openbill(this.state.allbills[year][month][date][bill]['bill'],this.state.allbills[year][month][date][bill]['amount'],this.state.allbills[year][month][date][bill]['category'],this.state.allbills[year][month][date][bill]['date'],this.state.allbills[year][month][date][bill]['merchantname'])} style={styles.bill}>
                                                    <View style={styles.billindex}>
                                                        <Text>BILL {num}</Text>
                                                    </View>
                                                    <View style={styles.billfield}>
                                                        <Text>CATEGORY:{this.state.allbills[year][month][date][bill]['category']}</Text>
                                                        <Text>{this.state.allbills[year][month][date][bill]['date']}</Text>
                                                    </View>
                                                    <View style={styles.billamount}>
                                                        <Text style={{alignSelf:'center'}}>{this.state.allbills[year][month][date][bill]['amount']}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                })
                            }
                        })
                    }
                })}
                {!this.state.loaded && this.state.numbills!=0 &&
                    <View style={{position:'absolute',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator size="large" color="blue" />
                    </View>
                }
            </ScrollView>
        )
    }

}