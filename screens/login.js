import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Entypo,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

global.width = Dimensions.get("window").width;
global.height = Dimensions.get("window").height;

export default function Login(props) {
  const [loginProgress, setLoginProgress] = useState(false);
  const [email, setEmail] = useState(null);

  const [pw, setPw] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const reset = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "ProfileName" }],
      })
    );
  };

  const storeData = async (value) => {
    try {
      //  const value = JSON.stringify(value)
      await AsyncStorage.setItem("access_token", value);
      props.setLogin(false);
    } catch (e) {
      // saving error
    }
  };

  
  const save_user = async (value) => {
    try {
      const value2 = JSON.stringify(value)
      await AsyncStorage.setItem("user", value2);
  
    } catch (e) {
      // saving error
   
    }
  };

  const sign_up = () => {
    setModalVisible(false);
    navigation.navigate("SignUp");
  };

  const get_user = (token) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer "+token
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://cms.peza24.com/users/me", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.hasOwnProperty("data")) {
          //save user_data
          save_user(response.data);
          storeData(token);
          
   
        } else {
          alert(response.errors[0].message);
        }
      })
      .catch((err) => console.error(err));
  };

  const login = () => {

    setLoginProgress(true);
 
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: pw,
      }),
    };

    fetch("https://cms.peza24.com/auth/login", options)
      .then((response) => response.json())
      .then((response) => {
        if (response.hasOwnProperty("data")) {
          //get user data & save user_data
          get_user(response.data.access_token);
          global.access_token = response.data.access_token;
          
      
         
          

        } else {
          setLoginProgress(false);
          alert(response.errors[0].message);
        }
      })
      .catch((err) => console.error(err));
  };

  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Create an account</Text>
            <Text style={{ fontSize: 36 }}>I am a</Text>

            <Pressable
              style={[styles.button4]}
              onPress={() => {
                (global.sign_up_url =
                  "https://app.peza24.com/signup-personal?p=m"),
                  sign_up();
              }}
            >
              <Text style={styles.textStyle}>
                <FontAwesome size={12} color="#fff" name="user-circle" />{" "}
                Customer
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button4]}
              onPress={() => {
                (global.sign_up_url =
                  "https://app.peza24.com/signup-freelancer?p=m"),
                  sign_up();
              }}
            >
              <Text style={styles.textStyle}>
                <FontAwesome size={12} color="#fff" name="user-circle" />{" "}
                Freelancer / Consultant
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button4]}
              onPress={() => {
                (global.sign_up_url = "https://app.peza24.com/signup-business?p=m"),
                  sign_up();
              }}
            >
              <Text style={styles.textStyle}>
                <FontAwesome size={12} color="#fff" name="briefcase" /> Business
              </Text>
            </Pressable>

            <Pressable
              style={{
                padding: 10,
                borderRadius: 30,
                borderColor: "#ddd",
                minWidth: "60%",
                borderWidth: 1,
                marginVertical: 30,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color: "#999", alignSelf: "center" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require("../assets/peza24-login.jpg")}
        style={{ flex: 1, padding: "10%", justifyContent: "flex-end" }}
      >
        <Text style={{ fontSize: 36, marginVertical: 5, color: "#fff" }}>
          Login<Text style={{ color: "#dd0000" }}>.</Text>
        </Text>
        <Text style={{ marginVertical: 10, color: "#fff" }}>
          Manage your account, projects, products/services & so much more.
        </Text>

        <Text style={{ marginVertical: 10, color: "#fff" }}>Email</Text>
        <TextInput
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            minWidth: global.width * 0.5,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onChangeText={(value) => {
            setEmail(value);
          }}
          placeholder={"eg. john@gmail.com"}
        />

        <Text style={{ marginVertical: 10, color: "#fff" }}>Password</Text>
        <TextInput
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            minWidth: global.width * 0.5,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onChangeText={(value) => {
            setPw(value);
          }}
          secureTextEntry={true}
        />
  {loginProgress? 
  <ActivityIndicator size="large" color="#fff" />:

        <Pressable style={[styles.button]} onPress={() => login()}>
          <Text style={styles.textStyle}>Login</Text>
        </Pressable>

  }

        <Pressable
          style={[styles.button2, styles.buttonClose]}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Text style={styles.textStyle}>Create Account</Text>
        </Pressable>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    color: "#fff",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 30,
    backgroundColor: "#dd0000",
    alignItems: "center",
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 30,
    backgroundColor: "#000020",
    alignItems: "center",
  },
  button3: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 30,
    backgroundColor: "#000020",
    alignItems: "center",
  },

  button4: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 30,
    backgroundColor: "#000020",
    minWidth: "60%",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  modalView: {
    margin: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    height: "75%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#222",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
