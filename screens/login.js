import React, { useState, useRef } from "react";
import { Text, View, Image, TextInput, Pressable, StyleSheet, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { Dimensions } from 'react-native';


global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function Login() {

    const [ email, setEmail ] = useState(null);

    const [ pw, setPw ] = useState(null);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={{ flex:1, backgroundColor:'#fff' }}>
<ImageBackground source={require('../assets/peza24-login.jpg')} style={{ flex:1, padding:'10%', justifyContent:'flex-end' }}>
<Text style={{ fontSize:36, marginVertical:5, color:'#fff' }}>Login<Text style={{ color:'#dd0000' }}>.</Text></Text>
<Text style={{ marginVertical:10, color:'#fff' }}>Manage your account, projects, products/services & so much more.</Text>

<Text style={{ marginVertical:10, color:'#fff' }}>Email</Text>
     <TextInput
        style={{ paddingHorizontal:10, paddingVertical:8, borderWidth:1, borderColor:'#ddd', minWidth: global.width * 0.5 , borderRadius:10, marginBottom:10 }}
        onChangeText={ value => { setEmail(value) } }
        placeholder={ "eg. john@gmail.com" }
      />

<Text style={{ marginVertical:10, color:'#fff' }}>Password</Text>
     <TextInput
        style={{ paddingHorizontal:10, paddingVertical:8, borderWidth:1, borderColor:'#ddd', minWidth: global.width * 0.5 , borderRadius:10, marginBottom:10 }}
        onChangeText={ value => { setPw(value) } }
        secureTextEntry={true}
      />

<Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Login</Text>
            </Pressable>

            <Pressable
              style={[styles.button2, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Create Account</Text>
            </Pressable>
</ImageBackground>
</KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
    textStyle: {
        color:'#fff'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop:30,
      backgroundColor:'#dd0000',
      alignItems:'center'
    },
    button2: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop:30,
        backgroundColor:'#000020',
        alignItems:'center'
      }
  });
