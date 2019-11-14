import React from 'react'
var moment = require('moment')
import {Text,View,StyleSheet,Alert,Button,Dimensions,ActivityIndicator} from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'
import DatePicker from 'react-native-datepicker'
import FloatingLabel from 'react-native-floating-labels'
import firebase from '../firebase'
import RNFetchBlob from 'rn-fetch-blob'
import { TextInput } from 'react-native-gesture-handler';
export default class AddBill extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            date:new Date().toLocaleDateString(),
            name:'',
            category:'',
            amount:'',
            data:'',
            filename:'',
            uid:'',
            loading:false,
            buttontext:'UPLOAD BILL PICTURE'
        }
        this.db = firebase.database()
        this.auth = firebase.auth()
        this.storage = firebase.storage()
    }
    changecategory=(t)=>{
        this.setState({
            category:t
        })
    }
    changemerchantname=(t)=>{
        this.setState({
            name:t
        })
    }
    changeamount = (t)=>{
        let numberpatt = /^[0-9]{1,}$/
        // console.log(t)
        // console.log(parseFloat(t))
        if(!t.match(numberpatt)){
            // alert("nan")

        }else{
            //
            this.setState({
                amount:t
            })
        }

    }
    changedate = (date)=>{
        this.setState({
            date:date
        })
    }
    openalert = ()=>{
        Alert.alert(
          'Add Image',
          'Select one',
          [
              {
                  text:'Take Picture',
                  onPress:()=>{this.opencamera()}
              },
              {
                  text:'Select from gallery',
                  onPress:()=>{this.opengallery()}
              }
          ],
          {cancelable:true}
          
        );

    }
    opencamera = ()=>{
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob
        ImageCropPicker.openCamera({
            width:Dimensions.get('screen').width,
            height:Dimensions.get('screen').height,
            cropping:true,
            
        }).then(image=>{
            const imagePath = image.path
            
            this.setState({upload1:imagePath})
            let mime = image.mime
            let uploadBlob = null
            fs.readFile(imagePath, 'base64')
                .then((data) => {
          //console.log(data);
                  return Blob.build(data, { type: `${mime};BASE64` })
               }).then(blob=>{
                   uploadBlob=blob
                   this.setState({
                    data:blob,
                    filename:`BILL_${new Date().getTime().toString()}`
                   })
                //    alert(image.filename)
               })
        })
    }
    opengallery = ()=>{
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob
      ImageCropPicker.openPicker({
          width:Dimensions.get('screen').width,
          height:Dimensions.get('screen').height,
          cropping:true

      }).then(image=>{
          const imagePath = image.path
          this.setState({upload1:imagePath})
          let mime = image.mime
          let uploadBlob = null
          fs.readFile(imagePath, 'base64')
              .then((data) => {
        //console.log(data);
                return Blob.build(data, { type: `${mime};BASE64` })
             }).then(blob=>{
                 uploadBlob=blob
                 this.setState({
                  data:blob,
                  filename:`BILL_${new Date().getTime().toString()}`,
                  buttontext:`BILL_${new Date().getTime().toString()}`
             })
        })
         
      })
    }
    componentWillUnmount(){
        this.authsubs()
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
    }
    uploadbill = ()=>{
        this.setState({
            loading:true
        })
        let cond = this.verifyamount() && this.verifyname()
        if(cond){
        let month
        // alert(this.state.date)
        let dt = new moment(this.state.date,"MM-DD-YYYY")
        let year = dt.year()
        let date = dt.date()
        let monthnum = dt.month()
        // alert(year.toString()+" "+date.toString()+" " + monthnum.toString())
        monthnum = monthnum+1
        if(monthnum==1) month='JANUARY'
        else if(monthnum==2) month='FEBRUARY'
        else if(monthnum==3) month='MARCH'
        else if(monthnum==4) month='APRIL'
        else if(monthnum==5) month='MAY'
        else if(monthnum==6) month='JUNE'
        else if(monthnum==7) month='JULY'
        else if(monthnum==8) month='AUGUST'
        else if(monthnum==9) month='SEPTEMBER'
        else if(monthnum==10) month='OCTOBER'
        else if(monthnum==11) month='NOVEMBER'
        else if(monthnum==12) month='DECEMBER'
         
            this.storage.ref('xbills').child(this.state.uid).child(year.toString()).child(month).child(date.toString()).child(this.state.filename).put(this.state.data).then(r=>{
                this.storage.ref('xbills').child(this.state.uid).child(year.toString()).child(month).child(date.toString()).child(this.state.filename).getDownloadURL().then(url=>{
                    
                    this.db.ref('xbills').child(this.state.uid).child(year.toString()).child(month).child(date.toString()).push({
                        'bill':url,
                        'merchantname':this.state.name,
                        'amount':this.state.amount,
                        'date':this.state.date,
                        'category':this.state.category
                    }).then(r1=>{
                        this.db.ref('annualexpenses').child(this.state.uid).child(year.toString()).child(month).once('value').then(amount=>{
                            let am = amount.exists()?parseInt(amount.val()['amount']):0
                            this.db.ref('annualexpenses').child(this.state.uid).child(year.toString()).child(month).update({'amount':am+parseInt(this.state.amount)})
                            this.db.ref('numbills').child(this.state.uid).once('value').then(num=>{
                                let n = num.exists()?parseInt(num.val()['num']):0
                                this.db.ref('numbills').child(this.state.uid).update({'num':n+1}).then(rr=>{
                                    this.authsubs()
                                    this.setState({loading:false})
                                    this.props.navigation.navigate('BillView',{billpic:url,category:this.state.category,date:this.state.date,amount:this.state.amount,merchname:this.state.name})
            
                                })
                            })
                        })
                    })
                })
            }).catch(e=>{
                alert("Error uploading the bill picture.Please try again")
                this.props.navigation.goBack()
            })
        }else{
            this.setState({
                loading:false
            })
            if(!this.verifyname()){
                alert('Please check merchant name')
            }
            if(!this.verifyamount()){
                alert('Please check amount')
            }
        }
    }
    verifyname = ()=>{
        if(this.state.name=='' || this.state.name==undefined || this.state.name==null){
            return false
        }
        else{
            return true
        }
    }
    verifyamount = ()=>{
        if(this.state.amount=='' || this.state.amount==undefined || this.state.amount==null){
            return false
        }
        else{
            return true
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
            inputcontainer:{
                marginTop:10,
                marginBottom:10,
                marginLeft:50,
                marginRight:50
            },
            inputfield:{
                borderWidth:0,
                fontSize:18
            },
            form:{
                borderBottomWidth:1,
                borderBottomColor:'black'
            },
            label:{
                color:'rgb(0,187,255)'
            },
            buttoncontainer:{
                alignItems:'center',
                marginTop:10,
                marginBottom:10
            },
            button:{

            }
        })
        return(
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={{alignSelf:'center',fontWeight:'bold',fontSize:20}}>Add Bill</Text>
                </View>

                <View style={styles.inputcontainer}>
                    <FloatingLabel onChangeText={t=>this.changemerchantname(t)} style={styles.form} inputStyle={styles.inputfield} labelStyle={styles.label}>Merchant Name</FloatingLabel>
                </View>

                <View style={styles.inputcontainer}>
                    <FloatingLabel style={styles.form}  onChangeText={t=>this.changecategory(t)} inputStyle={styles.inputfield} labelStyle={styles.label}>Category</FloatingLabel>
                </View>

                <View style={styles.inputcontainer}>
                    <FloatingLabel keyboardType='decimal-pad' style={styles.form}  value={this.state.amount} onChangeText={t=>this.changeamount(t)} inputStyle={styles.inputfield} labelStyle={styles.label}>Amount</FloatingLabel>
                    
                </View>

                <View style={styles.inputcontainer}>
                    <DatePicker
                    date={this.state.date}
                    onDateChange={date=>{this.changedate(date)}}
                        style={{width:'100%',
                        marginTop:10,
                        borderBottomWidth:1,
                        borderBottomColor:'black'}} 
                        mode="date"
                        placeholder="Select Date of payment"
                        format="MM-DD-YYYY"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateInput:{
                                borderWidth:0
                            },
                            placeholderText:{
                                color:'rgb(0,187,255)'
                            }
                        }}
                    />
                </View>

                <View style={styles.buttoncontainer}>
                    <Button title={this.state.buttontext} onPress={this.openalert}></Button>
                </View>
                <View style={styles.buttoncontainer}>
                    <Button title="Proceed" onPress={this.uploadbill}></Button>
                </View>
                {this.state.loading && <View style={{position:'absolute',width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator size="large" color="blue" />
                </View>}
            </View>
        )
    }
}