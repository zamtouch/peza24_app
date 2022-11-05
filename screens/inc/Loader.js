import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, Image, Text, Pressable, View } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoApp = forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(true);

  useImperativeHandle(ref, () => ({
  
    getAlert() {
      console.log( global.play_video );
      setModalVisible( true );
  }

  }));



  return (
    <View style={styles.centeredView}>
      <Modal
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
  
 <Image source={ require('../../assets/peza24_loader.gif') } resizeMode="contain" style={{ height:105, with:105 }} />
          </View>
        </View>
      </Modal>

    </View>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    backgroundColor:'#fff',
    flex:1,
    zIndex:2
  },
  modalView: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems:'center',
    flex:1
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

export default VideoApp;