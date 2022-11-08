import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const VideoApp = forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newRate, setRate] = useState(0);

  useImperativeHandle(ref, () => ({
  
    getAlert() {
        setRate( 0 );
      console.log( global.play_video );
      setModalVisible( true );
  }

  }));

  const check = ( value ) => {

    var res = value * global.rate;
    var final = numberWithCommas( res );

    setRate( final );

  }



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
            <View style={{ flex:1, padding:20 }}>
  
     <Text style={{ fontSize:28, fontWeight:'bold' }}>Currency Converter</Text>
     <Text style={{ paddingVertical:20, fontSize:20 }}>K{newRate}</Text>
<Text style={{ marginVertical:10 }}>{"Enter "+global.currency+" amount"}</Text>
     <TextInput
        style={{ paddingHorizontal:10, paddingVertical:8, borderWidth:1, borderColor:'#ddd', minWidth: global.width * 0.5 , borderRadius:10, marginBottom:10 }}
        onChangeText={ value => { check(value) } }
        placeholder={ "eg. 10000" }
        keyboardType='numeric'
      />
      <Text style={{ marginVertical:10 }}>{global.currency+" Rate @ K"+global.rate + ""}</Text>
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
});

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.85)'
  },
  modalView: {
    margin: 20,
    justifyContent: 'center',
  
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    height:'65%',
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

export default VideoApp;