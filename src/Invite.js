
import * as React from 'react';
import { StatusBar,ImageBackground,View, SafeAreaView ,ScrollView, Alert} from 'react-native';
import {Form,Text,Button,CheckBox,ListItem,Thumbnail,Left,Body,Item,Label,Input,Card,List} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {roles as rolesData} from './data'
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            users:[],
            roles:[],
            vampire:"",
            loading:false,
          }
    }
    componentDidMount(){
        const room = this.props.route.params.email;
        this._subscribeRoom = firestore().doc("game/"+room).onSnapshot(doc=>{
            const data = doc.data();
            console.log(data)
            this.setState({...data})
            if(data.start){
                this.componentWillUnmount()
                this.props.navigation.replace("Game",{email:room})
            }
        })
        this._subscribeUsers = firestore().collection("game/"+room+"/users").onSnapshot(docs=>{
            console.log(docs.docs)
            this.setState({users:docs.docs})
        })
    }
    componentWillUnmount(){
        this._subscribeRoom && this._subscribeRoom();
        this._subscribeUsers && this._subscribeUsers()
    }
    checkboxPress(role){
        const roomName = this.props.route.params.email;
        if(roomName!=auth().currentUser.email){
            return false;
        }
        const { roles }= this.state;
        const index = roles.indexOf(role.title)
        let newRoles;
        if(index==-1){
            newRoles=roles.concat([role.title])
        }else{
            newRoles=roles.filter(v=>v!=role.title)
        }
        this.setState({roles:newRoles})
        firestore().doc("game/"+roomName).update({roles:newRoles}).catch(err=>console.log(err))
    }
    changeVampire(value){
        const roomName = this.props.route.params.email;
        if(roomName!=auth().currentUser.email){
            return false;
        }
        this.setState({vampire:value})
        if(parseInt(value)>0){
            firestore().doc("game/"+roomName).update({vampire:parseInt(value)}).catch(err=>console.log(err))
 
        }
     }
     async startGame(){
         const {vampire,roles} = this.state;
         const roomName = this.props.route.params.email;
         var users = [...this.state.users]
         const toplamrol = parseInt(vampire) + roles.length;
        if(isNaN(toplamrol) || toplamrol>=users.length ){
            return Alert.alert("Oyuncudaki Vampirler ile Özel Roller Katılımcılardan Fazla!")
        }
        if(parseInt(vampire)<1){
            return Alert.alert("Oyunda hiç vampir yok. Oyunu Kazandınız!")
        }
        await this.setState({loading:true});
        let batch = firestore().batch();
        for (let index = 0; index < parseInt(vampire); index++) {
            var vampireUser = users[Math.floor(Math.random() * users.length)]
            users = users.filter(v=>v.id!=vampireUser.id)
            batch.update(firestore().doc("game/"+roomName+"/users/"+vampireUser.id),{role:"Vampir",ulti:"",live:true})
        }
        roles.map(role=>{
            var vampireUser = users[Math.floor(Math.random() * users.length)]
            users = users.filter(v=>v.id!=vampireUser.id)
            batch.update(firestore().doc("game/"+roomName+"/users/"+vampireUser.id),{role,ulti:"",live:true})
        })
        users.map(user=>{
            batch.update(firestore().doc("game/"+roomName+"/users/"+user.id),{role:"Köylü",ulti:"",live:true})
        })
        batch.update(firestore().doc("game/"+roomName),{start:true})
        await batch.commit().finally(()=>{
            this.setState({loading:false});
        });

     }
    render(){
        const roomName = this.props.route.params.email;
        const {users,roles,vampire,loading} = this.state;
 
        return (
        <>
            <StatusBar barStyle="dark-content" />
            <ImageBackground source={require('./img/bg.jpg')} resizeMode='cover' style={{width: '100%', height: '100%'}}>
            
            <ScrollView>
            <View style={{flexDirection:'column',height:'100%'}}>
            
            <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:60}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Arkadaşlarını Davet Et</Text>
            </View>
            <Card>
                <Form style={{width:'100%'}}>
                        <Item stackedLabel>
                        <Label>Oda Adı</Label>
                        <Input value={roomName} />
                        </Item>
                    </Form>
            </Card>
            <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:5}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Oyun Ayarları</Text>
            </View>
            
            <Card style={{marginHorizontal:50}}>
            <Form style={{width:'100%'}}>
                    <Item stackedLabel>
                    <Label>Vampir Sayısı</Label>
                    <Input keyboardType='number-pad' returnKeyType='done' value={vampire+""} onChangeText={(e)=>this.changeVampire(e)}/>
                    </Item>
                    {rolesData.filter(v=>!v.required).map(v=><ListItem key={"m"+v.title} onPress={()=>this.checkboxPress(v)}>
                        <CheckBox checked={roles.indexOf(v.title)>-1} onPress={()=>this.checkboxPress(v)}/>
                        <Body>
                            <Text>{v.title}</Text>
                        </Body>
                    </ListItem>)}
                </Form>
                {roomName==auth().currentUser.email && <Button disabled={loading} onPress={()=>this.startGame()} block style={{backgroundColor:'#27ae60',height:60,marginVertical:10}}>
                        <Text style={{fontSize:30}}>Başlat</Text>
                </Button>}
                </Card>
                <View style={{alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.7)',paddingVertical:10,marginTop:5}}>
                 <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>Katılımcılar ({users.length})</Text>
                </View>
                <Card>
                    <List>
            {users.map((v)=>v.data()).map((v,i)=><ListItem avatar key={i+v.email}>
              <Left>
                <Thumbnail source={{ uri: v.photoURL }} />
              </Left>
              <Body>
                <Text style={{color:'black',fontSize:20}}>{v.displayName}</Text>
                <Text note style={{color:'black'}}>{v.email}</Text>
              </Body>
            </ListItem>)}
            </List>
            </Card>
            </View>
            
            </ScrollView>
           
            </ImageBackground>
        </>
        )
    }
};
