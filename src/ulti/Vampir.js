import React,{ Component } from "react";
import {View} from 'react-native';
import {Text,ListItem,Left,Body,Thumbnail,Right,Badge} from 'native-base'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default class Vampir extends Component{
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
        const usersData = users.map(v=>v.data()).filter(v=>v.role!="Vampir" && v.live)
        if(usersData.length<1){
          return null;
        }
        return <View>
        <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:5}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Isır</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',marginTop:10}}>
            {usersData.map(v=>{
                const voteTotal = users.map(v=>v.data()).filter(vam=>vam.role=="Vampir" && vam.ulti==v.email).length
            return <ListItem avatar style={{marginVertical:5,width:'105%'}}
             key={v.email} onPress={()=> this.ulti(v)}>
              <Left style={{marginLeft:'5%'}}>
                <Thumbnail source={{ uri: v.photoURL }} />
              </Left>
              <Body style={{borderBottomColor:'white'}}>
                <Text style={{color:'black',fontSize:20}}>{v.displayName} - Köylü</Text>
              </Body>
              {voteTotal>0 &&<Right style={{marginRight:'5%',borderBottomColor:'white'}}>
                <Badge danger style={{width:40,height:40}}>
                        <Text style={{fontSize:20}}>{voteTotal}</Text>
                </Badge>
              </Right>}
            </ListItem>
            })}
          
         </View>
         </View>
    }
}