import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Switch } from 'react-native';

const SettingsModal = ({ visible, onClose, bgmEnabled, onToggleBgm, sfxEnabled, onToggleSfx }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ImageBackground
          source={require('../assets/images/clover_bg.png')}
          style={styles.modalBox}
          imageStyle={styles.imageBackgroundStyle}
        >

          <Text style={styles.title}>설정</Text>

          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>🎵 배경음</Text>
            <Switch
              value={bgmEnabled}
              onValueChange={onToggleBgm}
              thumbColor={bgmEnabled ? '#26A69A' : '#eee'}
              trackColor={{ true: '#80CBC4', false: '#ccc' }}
            />
          </View>

          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>🔊 효과음</Text>
            <Switch
              value={sfxEnabled}
              onValueChange={onToggleSfx}
              thumbColor={sfxEnabled ? '#26A69A' : '#eee'}
              trackColor={{ true: '#80CBC4', false: '#ccc' }}
            />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>

        </ImageBackground>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    borderRadius: 20,
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',

  },
  imageBackgroundStyle: {
    resizeMode: 'cover',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',           // 설정 텍스트는 검정색
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#1e4205',   // 더 진한 청록색 버튼
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 12,
    elevation: 8,                 // 입체 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 30,
    backgroundColor: '#1e4205',   // 더 어두운 청록색
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsModal;
