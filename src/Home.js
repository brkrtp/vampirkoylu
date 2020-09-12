
import * as React from 'react';
import { StatusBar,ImageBackground,View, Alert ,ScrollView} from 'react-native';
import {Card,Text,Button,Icon,ListItem,Thumbnail,Left,Body,List} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {roles} from './data'
import AsyncStorage from '@react-native-community/async-storage';
import JoinGame from './modal/NewGame'
import NasilOynanir from './modal/NasilOynanir'
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            photoURL:'hello',
            displayName:'',
            email:''
          }
    }
  componentDidMount(){
      const {photoURL,email,displayName} = auth().currentUser;
      this.setState({photoURL,email,displayName})
      AsyncStorage.getItem('lastGame').then((serverEmail)=>{
       if(serverEmail!=null){
        this.props.navigation.navigate("Game",{email:serverEmail})
       }
      })
  }
  async newGame(){
    const {photoURL,email,displayName} = auth().currentUser;    
    return await Promise.all([
      firestore().doc("game/"+email).set({
        start:false,day:0,vampire:1,roles:[]
      }),
      firestore().doc("game/"+email+"/users/"+email).set({photoURL,email,displayName}),     
      firestore().doc("game/"+email+"/users/test1").set({photoURL:"https://api.adorable.io/avatars/285/test1",email:"test1",displayName:"test1"}),  
      firestore().doc("game/"+email+"/users/test2").set({photoURL:"https://api.adorable.io/avatars/285/test2",email:"test2",displayName:"test2"}),
      firestore().doc("game/"+email+"/users/test3").set({photoURL:"https://api.adorable.io/avatars/285/test3",email:"test3",displayName:"test3"}), 
      firestore().doc("game/"+email+"/users/test4").set({photoURL:"https://api.adorable.io/avatars/285/test4",email:"test4",displayName:"test4"}),    
    ]).then(()=>{
      this.props.navigation.navigate("Invite",{email})
      AsyncStorage.setItem('lastGame',email)
    }).catch(err=>console.log(err))
  }
  joinGame(email){
    if(!email || email.length<3){
      return false;
    }
    const myEmail = auth().currentUser.email;  
    AsyncStorage.setItem("email",email);
    return firestore().doc("game/"+email).get().then((res)=>{
      if(!res.exists){
        return Alert.alert("Böyle bir oda bulunamadı!");
      }
      return firestore().doc("game/"+email+"/users/"+myEmail).get().then((userDoc)=>{
        if(!userDoc.exists && res.data().start){
          return Alert.alert("Bu oyuna katılamazsınız!","Oyun kurucusu oyunu başlatmış, katılamazsınız.");
        }
        if(!userDoc.exists){
          const {photoURL,displayName} = auth().currentUser;  
           firestore().doc("game/"+email+"/users/"+myEmail).set({photoURL,email:myEmail,displayName})
        }
        return this.props.navigation.navigate("Invite",{email})
      })
    })
  }
  render(){
    const {photoURL,email,displayName} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ImageBackground source={require('./img/bg.jpg')} resizeMode='cover' style={{width: '100%', height: '100%'}}>
         
         <ScrollView>
         <View style={{flexDirection:'column',height:'100%'}}>
           
           <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:60}}>
            <Text style={{fontSize:50,color:'white',fontWeight:'bold'}}>Vampir</Text>
            <Text style={{fontSize:50,color:'white',fontWeight:'bold'}}>Köylü</Text>
           </View>
           <View style={{backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:5}}>
           <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: photoURL }} />
              </Left>
              <Body>
                <Text style={{color:'white',fontSize:20}}>{displayName}</Text>
                <Text note style={{color:'white'}}>{email}</Text>
              </Body>
            </ListItem>
           </View>
           
           <View style={{marginHorizontal:10}}>
            <Button onPress={()=>this.newGame()} block style={{backgroundColor:'#27ae60',height:60,marginVertical:10}}>
                <Text style={{fontSize:30}}>Yeni Oyun Oluştur</Text>
            </Button>
            <Button block style={{backgroundColor:'#2980b9',height:60}} onPress={()=>this._joinGame.show()}>
                <Text style={{fontSize:30}}>Mevcut Bir Oyuna Katıl</Text>
            </Button>
            <Button block style={{backgroundColor:'#c0392b',height:60,marginTop:10}} onPress={()=>this._nasiloynanir.show()}>
                <Text style={{fontSize:30}}>Nasıl Oynanır?</Text>
            </Button>
            </View>
            
          
            <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',marginVertical:10,paddingVertical:5}}>
                <Text style={{fontSize:40,color:'white',fontWeight:'bold'}}>Özel Yetenekler</Text>
           
           </View>
            <Card>
            {roles.map(v=><ListItem thumbnail key={v.title} style={{flex:1}}>
              <Left>
                <Thumbnail square source={ v.image } resizeMode='cover'/>
              </Left>
              <Body>
                    <Text>{v.title}</Text>
                    <Text note numberOfLines={3}>{v.description}</Text>
              </Body>
             
            </ListItem>)}

          </Card>
         </View>
        
         </ScrollView>
         <JoinGame onRef={c=>this._joinGame=c} done={(text)=>this.joinGame(text)}/>
         <NasilOynanir onRef={c=>this._nasiloynanir=c} />
        </ImageBackground>
      </>
    )
  }
};
