import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatbotScreen = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = onVoiceResults;
    Voice.onSpeechError = onVoiceError;
    Voice.onSpeechStart = onVoiceStart;
    Voice.onSpeechEnd = onVoiceEnd;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const fetchRecipes = async (query: string) => {
    console.log('whats going?',query)
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query,
          apiKey: '292bd43fd3e64acfb08e9cc44290c1dc',
        },
      });
      setRecipes(response.data.results);
      console.log('results',response.data.results)
      await AsyncStorage.setItem('searchedRecipes', JSON.stringify(response.data.results));
    } catch (error) {
      setError('Failed to fetch recipes. Please try again.');
    }
  };

  const onVoiceStart = () => {
    console.log('listen')
    setIsListening(true);
  };

  const onVoiceEnd = () => {
    console.log('stop')
    setIsListening(false);
  };

  const onVoiceResults = (e: any) => {
    const text = e.value;
    console.log('speak',text)
    setQuery(text);
    fetchRecipes(text);
  };

  const onVoiceError = (e: any) => {
    setError('Voice recognition failed. Please try again.');
    setIsListening(false);
  };

  const startListening = async () => {
    console.log('listen to my song')
    setError('');
    setRecipes([]);
    setQuery('');
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    console.log('stopp to my song')
    try {
      await Voice.stop();
      await Voice.destroy();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const saveToShoppingList = async (recipe: any) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('shoppingList');
      const shoppingList = storedRecipes ? JSON.parse(storedRecipes) : [];
      const updatedList = [...shoppingList, recipe];
      await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedList));
      console.log('show items saved',updatedList)
      Alert.alert('Success', 'Recipe added to your shopping list.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
  };

  return (
    <View style={{backgroundColor:'red'}}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Type your recipe query"
      />
      <Button title="Search" onPress={() => fetchRecipes(query)} />
      <Button title={isListening ? "Stop Voice Search" : "Start Voice Search"} onPress={isListening ? stopListening : startListening} />

      {error ? <Text>{error}</Text> : null}

      <ScrollView>
        {recipes.map((recipe: any) => (
          <View key={recipe.id}>
            <Text>{recipe.title}</Text>
            <Button title="Save Ingredients" onPress={() => saveToShoppingList(recipe)} />
            <Text>{recipe.instructions}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatbotScreen;
