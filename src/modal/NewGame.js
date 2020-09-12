import Modal from "react-native-modal";
import React from 'react';
import {View} from 'react-native'
import {Text,Button,Item,Label,Input,Form,ListItem,CheckBox,Body} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
export default class NewGameModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
            email:"",
        }
        this.show=this.show.bind(this)
    }
    componentDidMount(){
        AsyncStorage.getItem("email").then(email=>{
            if(email!=null){
                this.setState({email})
            }
        })
        this.props.onRef(this)
    }
    show(){
        this.setState({visible:true})
    }
    render () {
        const {visible,email} = this.state;
        return (
          <View>
            <Modal isVisible={visible}
            onBackdropPress={() => this.setState({ visible: false })}
            >
              
             <View style={{
                    backgroundColor: 'white',
                    padding: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                }}>  
            <Form style={{width:'100%'}}>
                <Item stackedLabel>
                <Label>Oda Adı</Label>
                <Input keyboardType='email-address' value={email} onChangeText={(txt)=>this.setState({email:txt.toLocaleLowerCase()})} />
                </Item> 
            </Form>
               <Button block style={{backgroundColor:'#27ae60',height:60,marginVertical:10}} onPress={()=>{
                    this.setState({visible:false});
                    setTimeout(() => {
                        this.props.done(email)
                    }, 1000);
                   }}>
                    <Text style={{fontSize:30}}>Bağlan</Text>
                </Button>
                
                </View>
       
           
            </Modal>
          </View>
        )
      }
}