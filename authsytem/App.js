import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    profilePicture: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const savedUserData = await AsyncStorage.getItem('userData');
      const status = await AsyncStorage.getItem('isLoggedIn');
      if (savedUserData) setUserData(JSON.parse(savedUserData));
      if (status === 'true') setIsLoggedIn(true);
    };
    checkLoginStatus();
  }, []);

  const handleSubmit = async () => {
    if (isLogin) {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        if (userData.username === parsedData.username && userData.password === parsedData.password) {
          setIsLoggedIn(true);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          Alert.alert('Success', 'Logged in successfully');
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      }
    } else {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsLoggedIn(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      Alert.alert('Success', 'Registration successful');
      setIsLogin(true);
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserData({ username: '', password: '', firstName: '', lastName: '', email: '', contactNumber: '', address: '', profilePicture: '' });
    await AsyncStorage.removeItem('isLoggedIn');
  };

  const handleEdit = () => setIsEditing(true);
  const handleSaveChanges = async () => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated');
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? (
        <ScrollView style={styles.profileContainer}>
          <View style={styles.welcomeContainer}>
            <Image source={userData.profilePicture ? { uri: userData.profilePicture } : require('./assets/pfp.jpg')} style={styles.profilePicture} />
            <Text style={styles.welcomeText}>Welcome, {userData.firstName}!</Text>
            <View style={styles.detailsContainer}>
              {!isEditing ? (
                <>
                  {Object.entries(userData).map(([key, value]) => key !== 'profilePicture' && (
                    <Text style={styles.infoText} key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Text>
                  ))}
                </>
              ) : (
                Object.entries(userData).map(([key, value]) => key !== 'profilePicture' && (
                  <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChangeText={(text) => setUserData({ ...userData, [key]: text })}
                  />
                ))
              )}
            </View>
            <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSaveChanges : handleEdit}>
              <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Edit'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loginContainer}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <View style={styles.formContainer}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Create an Account'}</Text>
            {['username', 'password'].map((field, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={userData[field]}
                onChangeText={(text) => setUserData({ ...userData, [field]: text })}
                secureTextEntry={field === 'password'}
              />
            ))}
            <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileContainer: { padding: 20, backgroundColor: '#fff' },
  welcomeContainer: {
    alignItems: 'center',
    backgroundColor: '#e8e6e6',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profilePicture: { width: 150, height: 150, borderRadius: 80, borderWidth: 3, borderColor: '#fff', marginBottom: 10 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  detailsContainer: { width: '100%', marginVertical: 20 },
  infoText: { fontSize: 16, marginBottom: 10, color: '#000' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingLeft: 10 },
  editButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginTop: 20 },
  logoutButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  loginContainer: { padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  mainButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, marginBottom: 20 },
  switchText: { textAlign: 'center', color: '#007BFF' },
  formContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logo: { width: 220, height: 220, alignSelf: 'center', marginBottom: 30 },  
});

