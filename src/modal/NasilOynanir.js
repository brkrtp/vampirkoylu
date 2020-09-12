import Modal from "react-native-modal";
import React from 'react';
import {View} from 'react-native'
import {Text,Button} from 'native-base';
import { ScrollView } from "react-native-gesture-handler";
export default class NasilOynanir extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
        }
        this.show=this.show.bind(this)
    }
    show(){
        this.setState({visible:true})
    }
    componentDidMount(){
        this.props.onRef(this)
    }
    render () {
        const {visible} = this.state;
        return (
            <View>
                
            <Modal isVisible={visible}
            onBackdropPress={() => this.setState({ visible: false })}
            >
           <ScrollView horizontal={false}>
             <View style={{
                    backgroundColor: 'white',
                    margin: 20,
                    padding:22,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                }}>  
               
               
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:10}}>1. Oda Kur</Text> 
                     <Text style={{fontSize:16}}>Başlangıç için aranızdan bir kişinin yeni bir oyun kurması gerekmektedir.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>2. Arkadaşlarınızı Davet Edin</Text> 
                     <Text style={{fontSize:16}}>Diğer arkadaşlarınız oda adınızı kullanarak mevcut kurduğunuz oyuna katılsın. Oda adı en yukarıda yazmaktadır.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>3. Özel Roller</Text> 
                     <Text style={{fontSize:16}}>Oyunda özel roller bulunmaktadır. İsterseniz özel rolleri kullanabilirsiniz. Eğer özel roller olmadan oynamak istiyorsanız bu rolleri seçmeyin.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>4. Oyunu Başlat</Text> 
                     <Text style={{fontSize:16}}>Vampir sayısını ve özel rolleri ayarladıktan sonra oyunu başlatabilirsiniz.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>5. Oyun Nasıl Oynanır</Text> 
                     <Text style={{fontSize:16}}>Oyun kurucusu oyunu kontrol etmelidir. Herkes telefonundan oy vermeli ve yeteneklerini kullanmalı. Daha sonra oyun kurucu ertesi güne geçiş yapar. Oyunda ki amaç vampirlerin köylüleri, köylülerin ise vampileri oyundan çıkarmasıdır. Vampir haric bütün özel roller köylüdür.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>6. Oyun Kuralları</Text> 
                     <Text style={{fontSize:16}}>-Kimse kendi özel rolünü öldükten sonra bile söyleyemez.</Text> 
                     <Text style={{fontSize:16}}>-Vampir sayısı ile köylü sayısı eşit kaldığında oyunu vampirler kazanır.</Text> 
                     <Text style={{fontSize:16}}>-Oyundan çıkan kişiler oyuna tekrar girene kadar konuşamazlar.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>7. Strateji</Text> 
                     <Text style={{fontSize:16}}>Vampirler avcı mezarcı yada doktor olduğunu düşündürüp asıl avcı ve mezarcıyı saf dışı bırakmalı köylüler üzerinde güven kazanmalılar. Vampirler önce mezarcı ve doktoru oyun dışı bırakmalı daha sonra köylüleri oyundan çıkarmalılar.</Text> 
                     
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>8. Özel Yetenekler</Text> 
                     <Text style={{fontSize:16}}>Vampir, avcı, doktor, mezarci'nin özel yetenekleri bulunmaktadır. Bu kişiler oyun ekranının alt kısmında özel yeteneklerini kullanabilecekleri bir alan yer alır.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>- Vampir</Text> 
                     <Text style={{fontSize:16}}>Vampirlerin amacı köylüleri oyundan çıkarmaktır.Oyun kurucu sonraki güne geçmeden önce oyun ekranının ÖZEL YETENEK kısmından bir kişi oyundan çıkarmak için oy verebilirsiniz. Vampirler'den en çok oyu kim alırsa o kişi sonraki gün oyundan çıkacaktır.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>- Köylü</Text> 
                     <Text style={{fontSize:16}}>Büyün oyuncular aslında köylü görünümlüdür. Fakat gerçeği kimse bilemez. Köylülerin amacı vampirleri oyundan çıkarmaktır.Oyun kurucu sonraki güne geçmeden önce vampir olduğunu düşündüğünüz kişiyi oylarsınız. En çok oy alan ertesi gün oyundan çıkacaktır.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>- Doktor</Text> 
                     <Text style={{fontSize:16}}>Doktor özel yeteneği ile birini korur. Eğer vampirler kendi aralarında oyladıkları kişi ile doktor aynı kişiyi korursa o kişi ölmez. Doktor kendini koruyamaz.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>- Avcı</Text> 
                     <Text style={{fontSize:16}}>Avcının özel yeteneği oyunda seçtiği bir kişinin vampir yada köylü olduğunu öğrenmesidir. Öğrenmek istediği kişiyi seçer ve ertesi gün o kişinin özelliğini görebilir.</Text> 
                     <Text style={{fontSize:20,fontWeight:'bold',marginTop:2}}>- Mezarcı</Text> 
                     <Text style={{fontSize:16}}>Merzarcının özel yeteği oyundan çıkmış kişileri oyuna geri getirebilirmesidir. Mezarcı oyuna geri almak istediği kişiyi seçer ve sonraki gün o kişi oyuna geri döner.</Text> 
                    
                    <Button block style={{backgroundColor:'#c0392b',height:60,marginTop:10}} onPress={()=>this.setState({ visible: false })}>
                         <Text style={{fontSize:30}}>Kapat</Text>
                    </Button>
                    
                </View>
                </ScrollView>
            </Modal>
          </View>
        
        )
      }
}