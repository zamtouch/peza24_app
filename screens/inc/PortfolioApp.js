import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable,Image, View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

const PortfolioApp = forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
  
    getAlert() {
      console.log( global.project );
      setModalVisible( true );
  }

  }));


  if (global.project) {

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flex:1 }}>
            { global.project?.listing_type == 1 ?
          <Image
                  imageStyle={{
                    borderRadius: 5,
                    borderColor: "#ddd",
                    borderWidth: 1,
                  }}
                  source={{
                    uri:
                      "https://media.peza24.com/portfolio/" + global.project?.featured_image,
                  }}
                  resizeMode="contain"
                  style={{
                  
                    width: "100%",
                    height: global.width * 0.6,
                    backgroundColor:'#f0f0f0'
                  }}
                ></Image> :
                <WebView
                style={{ flex:1, borderRadius:10, height: global.width * 0.6 }}
                source={{ uri: 'https://www.youtube.com/embed/' + global.project?.video_id }}
              />
}

    <View style={{ alignItems:'center' }}>
    <Text style={{ marginVertical:15, fontWeight:'bold', fontSize:16 }}>{global.project.project_name}</Text>
        <Text>Created by:</Text>
        <TouchableOpacity onPress={ () => { navigation.navigate( "ViewProfile", {
              user: global.project.user_created
            } ), setModalVisible(!modalVisible) } } style={{ marginVertical:15, padding:10, backgroundColor:'#222', borderRadius:15 }}><Text style={{ color:'#fff' }}><FontAwesome style={styles.iconstyle} size={13} name="user" /> {global.project.user_created.first_name}</Text></TouchableOpacity>
        <Text style={{ fontWeight:'bold', marginTop:15 }}>Project Category:</Text>
        <Text>{global.project.main_category.name}</Text>
        <Text style={{ marginTop:15, fontWeight:'bold' }}>Description</Text>
        <Text>{global.project.description}</Text>

        <TouchableOpacity style={{ marginVertical:15, padding:10, backgroundColor:'#222', borderRadius:15 }}><Text style={{ color:'#fff' }}><FontAwesome style={styles.iconstyle} size={13} name="globe" /> Project Link <FontAwesome style={styles.iconstyle} size={11} name="arrow-right" /></Text></TouchableOpacity>
      
    </View>
    </View>
                   <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );

}
});

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.85)'
  },
  modalView: {
    margin: 20,
 
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    height:'85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop:30
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#dd0000',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PortfolioApp;