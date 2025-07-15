import React, { useRef, useState } from 'react';
import Container from '../../components/Container';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import OverlayLoading from '../../components/OverlayLoading';

const Start = () => {
    const handlePress = () => {
    navigation.navigate('Main');   // 이동할 화면 이름으로 수정
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Home.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
    <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Image
            source={require('../../assets/images/new_game.png')}  
            style={styles.buttonImage}
            resizeMode="contain"
        />
    </TouchableOpacity>
    <TouchableOpacity onPress={handlePress} style={styles.button2}>
        <Image
            source={require('../../assets/images/load_game.png')}  
            style={styles.buttonImage}
            resizeMode="contain"
        />
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20, 
    left: 250,   
    alignSelf: 'center'
  },
    button2: {
    position: 'absolute',
    bottom: 20,    
    right: 250,
    alignSelf: 'center'
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
    buttonImage: {
    width: 200,
    height: 80,
  },
});


export default Start