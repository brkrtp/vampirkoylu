
import * as React from 'react';
import { StatusBar,ImageBackground,View, SafeAreaView } from 'react-native';
import {Text,Button,Icon} from 'native-base';
import { LoginManager,AccessToken } from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen'

export default class App extends React.Component{
  componentDidMount(){
    this._subscribe = auth().onAuthStateChanged((user)=>{
      if(user){
        console.log(user);
        console.log(user.photoURL)
        this.props.navigation.navigate('Home')
      }
      
    })
    SplashScreen.hide();
  }
  async loginFacebook(){
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw new Error('User cancelled the login process');
    }
    const data = await AccessToken.getCurrentAccessToken();
 
    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }
    const credential = auth.FacebookAuthProvider.credential(data.accessToken);
    await auth().signInWithCredential(credential)
  }
  render(){
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ImageBackground source={require('./img/bg.jpg')} resizeMode='cover' style={{width: '100%', height: '100%'}}>
         <SafeAreaView>
         <View style={{flexDirection:'column',justifyContent:'space-evenly',height:'100%'}}>
           
           <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10}}>
            <Text style={{fontSize:50,color:'white',fontWeight:'bold'}}>Vampir</Text>
            <Text style={{fontSize:50,color:'white',fontWeight:'bold'}}>Köylü</Text>
           </View>

           <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10}}>
            <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Vampir Köylü Nasıl Oynanır?</Text>
            <Text style={{marginHorizontal:20,marginTop:2,fontSize:18,color:'white',textAlign:'center'}}>Oyunu'nuzu kurun ve arkadaşlarınızı oyuna davet edin, daha sonra oyunda özel rolleri ve vampir sayısını belirtin. Oyunu başlatın! Herkes kendi telefonundan özel yeteneklerini ve oyunu kullansın. İyi Olan Kazansın!</Text>
           </View>


            <Button iconLeft full style={{backgroundColor:'#3b5998',height:60}} onPress={()=>this.loginFacebook()}>
              <Icon style={{color:'white',fontSize:30}} name='logo-facebook' />

              <Text style={{color:'white',fontSize:30}}>Facebook ile Giriş</Text>
            </Button>
        
         </View>
         </SafeAreaView>
        </ImageBackground>
      </>
    )
  }
};
