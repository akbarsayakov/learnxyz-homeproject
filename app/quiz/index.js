import React, { useState } from 'react'
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

const Quiz = () => {
  const quizQuestion = {
    question: 'What is the capital of France?',
    choices: ['Berlin', 'Madrid', 'Paris', 'almaty'],
    correctAnswer: 'Paris',
  }

  const [selectedChoice, setSelectedChoice] = useState(null)

  const handleChoicePress = (choice) => {
    console.log('INSIDE HANDLE CHOICE')
    setSelectedChoice(choice)

    if (choice === quizQuestion.correctAnswer) {
      console.log('Correct choice selected')
      Alert.alert('Correct!', 'You answered the question correctly.')
    } else {
      Alert.alert('Incorrect', 'That is not the correct answer.')
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quizQuestion.question}</Text>
      {quizQuestion.choices.map((choice, index) => (
        <TouchableOpacity
          key={index}
          style={styles.choice}
          onPress={() => handleChoicePress(choice)}
        >
          <Text style={styles.choiceText}>{choice}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: 50,
    padding: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  choice: {
    zIndex: 100,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 18,
  },
})

export default Quiz
