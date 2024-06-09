import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Animated } from 'react-native';

interface QuizzsHeaderProps {
    currentIndex: number;
    quizzLength: number;
    setQuizzStarted: (value: boolean) => void;
  }
const QuizzsHeader: React.FC<QuizzsHeaderProps> = props => {
    
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        startAnimation();
    },[])

    const startAnimation = () => {
        let toValue = props.currentIndex / props.quizzLength;
        if(toValue === 0){
            toValue = 0.05;
        }
        Animated.timing(animatedValue, {
            toValue: toValue, 
            duration: 500,
            useNativeDriver: false, 
        }).start();
    };

    const showExitQuizAlert = async () => {
        Alert.alert(
          'Exit Quiz?',
          'Are you sure you want to exit the quiz? All progress will be lost.',
          [
            {text: 'Continue Quiz', onPress: () => {}},
            {
              text: 'Exit',
              onPress: () => {
                props.setQuizzStarted(false);
              },
            },
          ],
        );
      };

  return (
    <View style={styles.mainContainer}>
        <View style={styles.closeButtonContainer}>
            <Button 
                title='X'
                onPress={showExitQuizAlert}
            />
        </View>
        <View style={styles.progressBar}>
            <Animated.View
             style={[styles.progressBarFill]}
            >
                <TouchableOpacity
                style={[styles.closeButton]}
                onPress={showExitQuizAlert}
                >
                    <Text>X</Text>
                </TouchableOpacity>
            </Animated.View>
      </View>
    </View>
  )
}

export default QuizzsHeader;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 25,
      },
      closeButtonContainer: {
        marginRight: 10,
      },
      closeButton: {
        backgroundColor: 'transparent',
      },
      closeButtonTitle: {
        color: '#3B0D11',
        fontSize: 20,
        fontWeight: 'bold',
      },
      progressBar: {
        flex: 1,
        flexDirection: 'row',
        height: 20,
        backgroundColor: '#FFFCF9',
        elevation: 1,
        borderWidth: 0.4,
        borderRadius: 5,
        borderColor: 'black',
      },
      progressBarFill: {
        backgroundColor: '#FF6978',
      },
})