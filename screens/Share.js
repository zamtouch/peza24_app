import React from 'react';
import { Share, View, StyleSheet, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ChildComponent = (props) => {
  const onShare = () => {
    Share.share({ message: props.link });
  };

  return (
    <View>
      <Pressable style={[styles.button, styles.buttonClose]} onPress={onShare}><Text style={{ color:'#444' }}><Feather name="share" size="18" /> Share with friends / family</Text></Pressable>
    </View>
  );
};


const styles = StyleSheet.create({

    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop:20,
      alignItems:'center'
    },
    buttonOpen: {
      backgroundColor: '#000040',
    },
    buttonClose: {
      backgroundColor: '#fff',
      borderColor:'#999',
      borderWidth:1
    }
  });

export default ChildComponent;