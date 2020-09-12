import React,{ Component } from "react";
import {View} from 'react-native';
import {Text,ListItem,Left,Body,Thumbnail,Right,Badge} from 'native-base'
import auth from '@react-native-firebase/auth';
import {rip} from '../data'
export default class Avci extends Component{
    ulti(doc){
        if(doc.email==auth().currentUser.email){
            return false;
        }
        const {users} = this.props;
        const find = users.find(v=>v.id==auth().currentUser.email);
        return find && find.ref.update({ulti:doc.email})
    }
    render(){
        const {users} = this.props;
      
        const find = users.find(v=>v.id==auth().currentUser.email);
        const avciData = (find && find.data().data) || []
        const userData = users.map(v=>v.data()).filter(v=>v.live && v.email!=auth().currentUser.email && avciData.indexOf(v.email)==-1)
        if(userData.length<1){
          return null;
        }
        return <View>
        <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:5}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Avla</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',marginTop:10}}>
            {userData.map(v=>{
            const voted = find && find.data().ulti==v.email;
            return <ListItem avatar style={{marginVertical:5,width:'105%',backgroundColor:voted?'#2c3e50':'white'}}
             key={v.email} onPress={()=> this.ulti(v)}>
              <Left style={{marginLeft:'5%'}}>
                <Thumbnail source={{ uri: v.photoURL }} />
              </Left>
              <Body style={{borderBottomColor:voted?'#2c3e50':'white'}}>
                <Text style={{color:voted?'white':'black',fontSize:20}}>{v.displayName}</Text>
              </Body>
              
            </ListItem>
            })}
          
         </View>
         </View>
    }
}