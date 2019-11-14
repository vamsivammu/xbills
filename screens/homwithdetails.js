import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
export default class Home extends React.Component{


    constructor(props){
        super(props)
        this.state = {
            merchant:this.props.navigation.getParam('merchant','none'),
            merchantuid:this.props.navigation.getParam('merchuid','none')
        }
    }
    gotomydata = ()=>{

    }
    gotoscanpage = ()=>{

    }
    gotobillspage = ()=>{

    }
    gotoannualpage = ()=>{

    }
    gotomerchantspage = ()=>{

    }
    render(){
        const styles = StyleSheet.create({
            container:{
                flex:1,
                alignSelf:'stretch',
                backgroundColor:'#AFEEEE',
                
            },
            header:{
                marginTop:20,
                marginBottom:20
            }
        })
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{alignSelf:'center'}} onPress={this.gotomydata}>My QR Code</Text>
                </View>

                <View style={styles.header}>
                    <Text style={{alignSelf:'center'}}>TAP <Text onPress={()=>this.props.navigation.navigate('ScanPage')} style={{color:'skyblue'}}>HERE</Text> TO GET EBILLS FROM RETAILER</Text>
                </View>
                
                <View>
                    <Text></Text>
                </View>

            </View>
        )

    }

}
