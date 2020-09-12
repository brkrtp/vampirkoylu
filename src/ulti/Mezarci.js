import React,{ Component } from "react";
import {View} from 'react-native';
import {Text,ListItem,Left,Body,Thumbnail,Right,Badge} from 'native-base'
import auth from '@react-native-firebase/auth';
import {rip} from '../data'
export default class Mezarci extends Component{
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
        const usersData = users.map(v=>v.data()).filter(v=>!v.live)
        if(usersData.length<1){
          return null;
        }
        return <View>
        <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:5}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Canlandır</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',marginTop:10}}>
            {usersData.map(v=>{
            const voted = find && find.data().ulti==v.email;
            return <ListItem avatar style={{marginVertical:5,width:'105%',backgroundColor:voted?'#27ae60':'white'}}
             key={v.email} onPress={()=> this.ulti(v)}>
              <Left style={{marginLeft:'5%'}}>
                <Thumbnail source={{ uri: rip }} />
              </Left>
              <Body style={{borderBottomColor:voted?'#27ae60':'white'}}>
                <Text style={{color:voted?'white':'black',fontSize:20}}>{v.displayName}</Text>
              </Body>
              
            </ListItem>
            })}
          
         </View>
         </View>
    }
}