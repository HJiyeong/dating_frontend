import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

const characters = [
  {
    image: require('../../assets/images/character/seoyeon_detail.png'),
    labelImage: require('../../assets/images/index_yellow.png'),
    name: '서연 | 23, INTJ, 한국대',
    description: '...딱히 관심은 없는데... 코딩 실력은 최상급, 감정 표현은 최저점. 연애에는 서툴지만 묵묵히 신경쓰이는 그녀. 1주차 랜덤팀.',
  },
  {
    image: require('../../assets/images/character/harin_detail.png'),
    labelImage: require('../../assets/images/index_red.png'),
    name: '하린 | 23, ENFP, 한국대',
    description: '“에이~ 연애? 당연히 로망이지!” 팀 분위기를 띄우는 에너지 담당.코딩은 서툴지만 누구보다 따뜻한 마음. 로맨틱한 연애를 꿈꾸는 그녀.',
  },
  {
    image: require('../../assets/images/character/hero_detail.png'),
    labelImage: require('../../assets/images/index_green.png'),
    name: '당신 | 23, INTP, KAIST',
    description: '“모태솔로 탈출... 할 수 있을까?” 연애는 해본 적 없지만 이번 캠프에 은근히 기대 중. 하지만 쑥맥이라 하루하루가 우당탕탕,  쉽지 않은 연애 시뮬레이션.',
  },
  {
    image: require('../../assets/images/character/jihoo_detail.png'),
    labelImage: require('../../assets/images/index_green.png'),
    name: '지후 | 23, ESTJ, KAIST',
    description: '“서연? 내가 신경 쓰는 상대지.”실력도 외모도 인기까지 다 가진 라이벌.2, 3주차에서 당신의 강력한 경쟁자가 된다.',
  },
{
  image: require('../../assets/images/character/jinseop_detail.png'),
  labelImage: require('../../assets/images/index_yellow.png'),
  name: '진섭 | 23, ENTP , KAIST',
  description: '“...왜 아무도 안 웃지?” 늘 시끄럽고 말이 많은데 외면당하는 개그 담당. 눈치는 제로, 존재감은 마이너스.',
},
  {
    image: require('../../assets/images/character/nubzuki_detail.png'),
    labelImage: require('../../assets/images/index_blue.png'),
    name: '넙죽이',
    description: '“공지 확인 안 하면 몰입캠프 탈락입니다~” 언제나 공지를 전달하는 친숙한 마스코트.게임 전반에서 공지/가이드 역할.',
  },
];

const Detail = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTexts, setShowTexts] = useState(false);

  const translateXAnim = useRef(new Animated.Value(-width)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const character = characters[currentIndex];
  const isEven = currentIndex % 2 === 0;

  useEffect(() => {
    startEntranceAnimation();
  }, [currentIndex]);

  const startEntranceAnimation = () => {
    setShowTexts(false);
    translateXAnim.setValue(isEven ? -width : width);

    Animated.sequence([
      Animated.timing(translateXAnim, {
        toValue: isEven ? width * 0.1 : -width * 0.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]),
        { iterations: 2 }
      ),
    ]).start(() => {
      setShowTexts(true);
    });
  };

  const exitAndNextCharacter = () => {
    setShowTexts(false);
    Animated.timing(translateXAnim, {
      toValue: isEven ? -width : width,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (currentIndex < characters.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    });
  };

  const characterStyle = {
    transform: [
      { translateX: translateXAnim },
      { translateX: shakeAnim },
    ],
    position: 'absolute',
    top: height * 0.15,
    ...(isEven
      ? { left: width * 0.05 }
      : { right: width * 0.05 }),
  };

  const labelContainerStyle = {
    position: 'absolute',
    top: height * 0.15,
    ...(isEven
      ? { right: width * 0.05, alignItems: 'flex-end' }
      : { left: width * 0.05, alignItems: 'flex-start' }),
  };

  return (
    <ImageBackground
      source={require('../../assets/images/detail.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
    <View style={labelContainerStyle}>
      <View style={styles.labelWithTextContainer}>
        <Image
          source={character.labelImage}
          style={styles.labelImage}
          resizeMode="contain"
        />
        <Text style={styles.labelText}>{character.name}</Text>
      </View>
    </View>


    <Animated.View style={[characterStyle, styles.shadowBox]}>
      <Image
        source={character.image}
        style={styles.characterImage}
        resizeMode="contain"
      />
    </Animated.View>


      {showTexts && (
        <View style={[
          styles.descriptionContainer,
          isEven
            ? { right: width * 0.05, alignItems: 'flex-end' }
            : { left: width * 0.05, alignItems: 'flex-start' }
        ]}>
          <TypewriterText text={character.description} delay={30} />
         </View>
      )}

      {showTexts && (
  <TouchableOpacity
    onPress={exitAndNextCharacter}
    style={styles.fixedNextButton}
  >
    <Text style={styles.buttonText}>다음</Text>
  </TouchableOpacity>
)}
    </ImageBackground>
  );
};

const TypewriterText = ({ text, delay }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text]);
  return <Text style={styles.descriptionText}>{displayText}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  labelWithTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'myfont',
  },

  labelImage: {
    width: 300,
    height: 80,
  },

  labelText: {
    position: 'absolute',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'myfont',
  },

  characterImage: {
    width: width * 0.5,
    height: height * 0.9,
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    width: width * 0.4,
  },
  descriptionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    lineHeight: 28,
    fontFamily: 'myfont',
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'myfont',
  },
  fixedNextButton: {
  position: 'absolute',
  right: width * 0.05,
  bottom: height * 0.05,
  backgroundColor: '#333',
  padding: 10,
  borderRadius: 10,
},
shadowBox: {
  shadowColor: 'rgb(0,0,0)',
  shadowOffset: { width: 50, height: 60 },
  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 50, 
},


});

export default Detail;
