import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import Login from './src/Login';
import Home from './src/Home';
import Invite from './src/Invite';
import Game from './src/Game';
const Stack = createStackNavigator();
function App() {
  firestore().settings({persistence:false})
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode='none' initialRouteName='Login'>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Invite" component={Invite} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
export default App;