import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoApp = forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
  
    getAlert() {

   
      setModalVisible( true );

    

  }

  }));



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
  
          <WebView
      style={{ flex:1, borderRadius:10 }}
      source={{ uri: "https://app.peza24.com/doc-reader/view.php?i=https://cms.peza24.com/assets/" + global.catalogue?.pdf_file.id }}
    />
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
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.6)'
  },
  modalView: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    height:'90%',
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
    marginTop:20
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