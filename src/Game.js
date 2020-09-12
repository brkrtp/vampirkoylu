
import * as React from 'react';
import { StatusBar,ImageBackground,View, Alert ,ScrollView} from 'react-native';
import {Text,Button,ListItem,Thumbnail,Left,Body,Card,Badge, Right} from 'native-base';
import Vampir from './ulti/Vampir';
import Mezarci from './ulti/Mezarci';
import Avci from './ulti/Avci';
import Doktor from './ulti/Doktor';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {rip,roles as rolesData} from './data'
import AsyncStorage from '@react-native-community/async-storage';
import NasilOynanir from './modal/NasilOynanir'
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            users:[],
            day:0
          }
    }
    componentDidMount(){
      
        const room = this.props.route.params.email;
        this._subscribeRoom = firestore().doc("game/"+room).onSnapshot(doc=>{
            this.setState({...doc.data()})
        })
        this._subscribeUsers = firestore().collection("game/"+room+"/users").onSnapshot(docs=>{
            const allUsers = docs.docs.map(user=>{               
                user.total = docs.docs.filter(doc=>doc.data().live && doc.data().vote==user.data().email).length
                user.kill = docs.docs.filter(doc=>doc.data().live && doc.data().role=="Vampir" && doc.data().ulti==user.data().email).length
                return user;
            });
            this.setState({users:allUsers})
        })
    }
    componentWillUnmount(){
        this._subscribeRoom && this._subscribeRoom();
        this._subscribeUsers && this._subscribeUsers()
    }
    renderUlti(role,user,users){
        if(role.title=="Vampir"){
            return <Vampir users={users}/>
        }
        if(role.title=="Avcı"){
            return <Avci users={users}/>
        }
        if(role.title=="Mezarcı"){
            return <Mezarci users={users}/>
        }
        if(role.title=="Doktor"){
            return <Doktor users={users}/>
        }
        return null
       
    }
    vote(user,me){
        this.setState({loading:true})
        if(user.email==auth().currentUser.email || !user.live){
            return false;
        }
        const room = this.props.route.params.email;
        const vote = user.email==me.data().vote ? "" : user.email
        return firestore().doc("game/"+room+"/users/"+auth().currentUser.email).update({vote}).finally(()=>{
            this.setState({loading:false})
        })
    }
    nextDayAlert(){
        const usersData = this.state.users.filter(v=>v.data().live && (!v.data().vote || v.data().vote.length<2)).length
        if(usersData>0){
            return Alert.alert(
                'Oy Vermemiş Katılımcılar Var',
                'Devam etmek istiyormusunuz?',
                [
                  {
                    text: 'İptal',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'DEVAM', onPress: () => this.nextDay()},
                ],
                {cancelable: false},
              );
        }
        this.nextDay();
    }
    async nextDay(){
        const roomName = this.props.route.params.email;
        let batch = firestore().batch();
        const usersData = this.state.users.filter(v=>v.data().live)

        const killIndex = usersData.map(v=>v.kill).reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        const killVoteIndex = usersData.map(v=>v.total).reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        const mezarci = usersData.find(v=>v.data().role=="Mezarcı")
        const doktor = usersData.find(v=>v.data().role=="Doktor")
        const avcimiz = usersData.find(v=>v.data().role=="Avcı")
       
        if(mezarci && mezarci.data().ulti.length>2){
            batch.update(firestore().doc("game/"+roomName+"/users/"+mezarci.data().ulti),{live:true})
        }
        const userDie = usersData[killIndex]
        if(userDie.kill>0 && doktor && doktor.data().ulti==userDie.data().email){
            //ÖLMEDİ
        }else if(userDie.kill>0){
            batch.update(firestore().doc("game/"+roomName+"/users/"+userDie.id),{live:false})
        }
        const userDie2 = usersData[killVoteIndex]
        if(userDie2 && userDie2.total>0){
            batch.update(firestore().doc("game/"+roomName+"/users/"+userDie2.id),{live:false})
        }
        if(avcimiz && avcimiz.data().ulti.length>2){
            const data = (avcimiz.data().data || []).concat([avcimiz.data().ulti])
            batch.update(firestore().doc("game/"+roomName+"/users/"+avcimiz.id),{data})
        }
        this.state.users.map(v=>{
            batch.update(firestore().doc("game/"+roomName+"/users/"+v.id),{ulti:"",vote:""})
        })
        batch.update(firestore().doc("game/"+roomName),{day:firestore.FieldValue.increment(1)})
        this.setState({loading:true})
        return batch.commit().finally(()=> this.setState({loading:false}));
    }
    quit(){
        const roomName = this.props.route.params.email;
        Alert.alert(
            'Oyundan Çık',
            'Oyundan çıkmak istediğinize eminmisiniz?',
            [
              {
                text: 'İptal',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Çık', onPress: () => {
                  if(roomName==auth().currentUser.email){
                      let batch = firestore().batch();
                      this.state.users.map(v=>{
                          batch.delete(firestore().doc("game/"+roomName+"/users/"+v.id))
                      })
                      batch.commit();
                  }
                  AsyncStorage.removeItem("lastGame")
                  this.props.navigation.replace("Home")
                }},
            ],
            {cancelable: false},
          );
    }
    render(){
        const roomName = this.props.route.params.email;
        const {users,loading,day} = this.state;  
        const user = users.find(v=>v.id==auth().currentUser.email)    
        const avciData = (user && user.data().data) || []
        const role = user && rolesData.find(v=>v.title==user.data().role)
        const vampirSay = users.filter(v=>v.data().role=="Vampir" && v.data().live).length
        const koyluSay = users.filter(v=>v.data().role!="Vampir" && v.data().live).length
        return (
        <>
            <StatusBar barStyle="dark-content" />
            <ImageBackground source={require('./img/bg.jpg')} resizeMode='cover' style={{width: '100%', height: '100%'}}>
            
            <ScrollView>
            <View style={{flexDirection:'column',height:'100%'}}>
            
           
            <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:60}}>
             <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>{day+1}. Gün</Text>
            </View>
             {role && <Card><ListItem avatar>
              <Left>
                <Thumbnail source={ role.image } />
              </Left>
              <Body>
                <Text style={{color:'black',fontSize:20}}>{role.title}</Text>
                <Text note style={{color:'black'}}>{role.description}</Text>
              </Body>
            </ListItem></Card>}
            {(koyluSay==0 || vampirSay==0 || vampirSay==koyluSay) ? <View>
                <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:60}}>
                    {(koyluSay==0 || vampirSay==koyluSay) && <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Vampirler Kazandı!</Text>}
                    {vampirSay==0 && <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Vampirler Kazandı!</Text>}
                </View>
            </View>
            : <View>
            {roomName==auth().currentUser.email && <Button disabled={loading} onPress={()=>this.nextDayAlert(users)} block style={{backgroundColor:'#27ae60',height:60,marginVertical:10}}>
                        <Text style={{fontSize:30}}>Sonraki Gün</Text>
            </Button>}
           
            <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:5}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Oylama Zamanı</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',marginTop:10}}>
            {users.map((doc,iii)=>{
                const avciGoster = avciData.indexOf(doc.id)!=-1;
                const v = doc.data()
                const isVampire = role && role.title=="Vampir" && v.role=="Vampir"
                const voted = user && user.data().vote==v.email
            return <ListItem avatar style={{marginVertical:5,width:'105%',backgroundColor:voted?'#c0392b':'white'}}
             key={iii+v.email} onPress={()=> this.vote(v,user)}>

              <Left style={{marginLeft:'5%'}}>
                <Thumbnail source={{ uri: v.live?v.photoURL:rip }} />
              </Left>
              <Body style={{borderBottomColor:voted?'#c0392b':'white'}}>
             <Text style={{color:voted?'white':'black',fontSize:20}}>{v.displayName} {avciGoster && v.role} {(!v.live)?"- ÖLDÜ":(isVampire?"- Vampir":"")}</Text>
              
              </Body>
              <Right style={{marginRight:'5%',borderBottomColor:voted?'#c0392b':'white'}}>
                <Badge danger style={{width:40,height:40}}>
                        <Text style={{fontSize:20}}>{doc.total}</Text>
                </Badge>
              </Right>
            </ListItem>
            })}
          
             </View>
             {role && this.renderUlti(role,user,users)}
             </View>}
             <Button block style={{backgroundColor:'#f39c12',height:60,marginTop:10}} onPress={()=>this._nasiloynanir.show()}>
                <Text style={{fontSize:30}}>Nasıl Oynanır?</Text>
            </Button>
            <Button  onPress={()=>this.quit()} block style={{backgroundColor:'#c0392b',height:60,marginVertical:10}}>
                        <Text style={{fontSize:30}}>Oyundan Çık</Text>
            </Button>
            </View>
            <View style={{height:100}}/>
            </ScrollView>
            <NasilOynanir onRef={c=>this._nasiloynanir=c} />
            </ImageBackground>
        </>
        )
    }
};
