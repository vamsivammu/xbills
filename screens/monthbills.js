import React from 'react'
import {Text,View,StyleSheet,ScrollView,BackHandler} from 'react-native'
import {NavigationEvents} from 'react-navigation'
export default class MonthBills extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading:true,
            monthbills:{},
            month:'',
            year:''
        }
    }
    componentDidMount(){
        let monthbills = this.props.navigation.getParam('bills',{})
        let month = this.props.navigation.getParam('month','')
        let year = this.props.navigation.getParam('year','')
        this.setState({
            monthbills:monthbills,
            month:month,
            year:year,
            loading:false
        })
    }
    openbill(bill,amount,category,date,merchname){

        this.props.navigation.navigate('BillView',{billpic:bill,category:category,date:date,amount:amount,merchname:merchname})
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
        let num =0
        return(
            <ScrollView style={styles.container}>
                {/* <NavigationEvents
                    onDidBlur={()=>{this.backhandler.remove()}}
                    onDidFocus = {()=>{
                        this.backhandler = BackHandler.addEventListener('hardwareBackPress',()=>{
                            // console.log("pressed from month")
                            this.props.navigation.navigate('AnnualBills')
                            return true
                        })
                    }}
                /> */}
                <View style={styles.header}>
                    <Text style={{alignSelf:'center',fontSize:25}}>{this.state.month} {this.state.year}</Text>
                </View>
                {!this.state.loading && Object.keys(this.state.monthbills).length>0 && Object.keys(this.state.monthbills).map((r,i)=>{
                    return Object.keys(this.state.monthbills[r]).length>0 && Object.keys(this.state.monthbills[r]).map(r1=>{
                        console.log(this.state.monthbills,r1)
                        num =num+1 
                        return(
                            <View onTouchEnd={()=>this.openbill(this.state.monthbills[r][r1]['bill'],this.state.monthbills[r][r1]['amount'],this.state.monthbills[r][r1]['category'],this.state.monthbills[r][r1]['date'],this.state.monthbills[r][r1]['merchantname'])} style={styles.bill}>
                                <View style={styles.billindex}>
                                    <Text>BILL {num}</Text>
                                </View>
                                <View style={styles.billfield}>
                                    <Text>CATEGORY:{this.state.monthbills[r][r1]['category']}</Text>
                                    <Text>{this.state.monthbills[r][r1]['date']}</Text>
                                </View>
                                <View style={styles.billamount}>
                                    <Text style={{alignSelf:'center'}}>{this.state.monthbills[r][r1]['amount']}</Text>
                                </View>
                            </View>
                        )
                    })
                })}


            </ScrollView>
        )
    }

}