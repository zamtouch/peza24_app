import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from "./Loader";

const JobApp = forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ visible, setVisible ] = useState(false);

  useImperativeHandle(ref, () => ({
  
    getAlert() {

      setModalVisible( true );

  }

  }));

  const close_loader = () => {

    
    setTimeout(function() {
      setVisible(false)
    }, 1000);

  
  }


  return (
    <View style={styles.centeredView}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          {visible ? <Loader /> : null}
          <WebView
                onLoadStart={() => setVisible(true)}
                onLoad={() => close_loader() }
      style={{ flex:1, borderRadius:10 }}
      shouldStartLoadWithRequest={false}
      source={{ uri: 'https://app.peza24.com/mobile/job-details.php?a=' + global.job }}
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
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.85)',
    
  },
  modalView: {
    margin:15,
    marginTop: '12%',
    marginBottom:'12%',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
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

export default JobApp;