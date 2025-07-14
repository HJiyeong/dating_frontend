import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Container from '../../components/Container';

const dialogList = [
  '첫번쨰 대사',
  '두번쨰 대사.',
  '아아아아',
];


const WorkspaceScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentIndex >= dialogList.length) return;

    setDisplayedText('');
    setIsTyping(true);

    const text = dialogList[currentIndex];
    let index = 0;

    const interval = setInterval(() => {
    if (index < text.length) {
        const nextChar = text.charAt(index);   // 먼저 문자 추출
        setDisplayedText((prev) => prev + nextChar);
        index++; // 이걸 setState 바깥에서 나중에 증가시켜야 안정적
    } else {
        clearInterval(interval);
        setIsTyping(false);
    }
    }, 100);


    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isTyping) return; // 타이핑 중일 땐 넘기기 방지
    if (currentIndex < dialogList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={{ flex: 1 }}
    >
      <Container style={styles.overlay}>

        <TouchableOpacity style={styles.settingsButton} onPress={() => console.log('설정 클릭')}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>

        <View style={styles.characterContainer}>
          <Image
            source={require('../../assets/images/sample_img.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.dialogBox}>
          <View style={styles.nameBox}>
            <Text style={styles.nameText}>이름</Text>
          </View>
          <Text style={styles.dialogText}>{displayedText}</Text>


        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={{ color: 'white' }}>▶</Text>
          </TouchableOpacity>



        </View>

      </Container>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },

  characterContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingRight: 24,
    zIndex: 1,  
  },

  characterImage: {
    width: 300,
    height: 400,
  },

  dialogBox: {
    position: 'absolute',  
    bottom: 20,
    width: '80%',
    height: 100,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    zIndex: 10,   
  },

  nameBox: {
    position: 'absolute',
    top: -26,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },

  nameText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },

  dialogText: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 28,
    textAlign: 'center',
  },
  nextButton: {
  marginTop: 12,
  alignSelf: 'flex-end',
  backgroundColor: 'rgba(255,255,255,0.2)',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
 },

  settingsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 20,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 8,
  },
});


export default WorkspaceScreen;
