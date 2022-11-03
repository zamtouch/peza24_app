import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MaterialCommunityIcons, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import Home from './screens/home';
import Jobs from './screens/jobs';
import Promos from './screens/promos';

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

function Logo() {
  return (
    <Image
      style={{ width: 90, height: 30 }}
      source={require('./assets/peza24.png')}
    />
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );

}function Marketplace() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#cc0000"
      inactiveColor="#777"
      barStyle={{ backgroundColor: '#fff' }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Jobs}
        options={{
          tabBarLabel: 'Jobs & Tenders',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="briefcase" color={color} size={26} />
          ),
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }
        }}
      />

<Tab.Screen
        name="Promos"
        component={Promos}
        options={{
          tabBarLabel: 'Promos',
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-bag" color={color} size={26} />
          ),
        }}
      />

<Tab.Screen
        name="Marketplace"
        component={Marketplace}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator>
        <Stack.Screen
          name=" "
          component={MyTabs}
          options={{ headerShown: true, headerTitle: (props) => <Logo {...props} /> }}
        />
        <Stack.Screen name="Profile" component={Home} />
        <Stack.Screen name="Settings" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
