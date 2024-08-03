import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, FlatList, ListRenderItem, Image, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Defining the type for receipes
type Recipe = {
    id: number;
    title: string;
    image: string;
};

const ChatbotScreen = () => {
    const [query, setQuery] = useState<string>('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);

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
        console.log('whats going?', query);
        try {
            const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
                params: {
                    query,
                    apiKey: '292bd43fd3e64acfb08e9cc44290c1dc',
                },
            });
            setRecipes(response.data.results);
            await AsyncStorage.setItem('searchedRecipes', JSON.stringify(response.data.results));
        } catch (error) {
            setError('Sorry,failed to fetch recipes. Please try again.');
        }
    };

    const onVoiceStart = () => {
        setIsListening(true);
    };

    const onVoiceEnd = () => {
        setIsListening(false);
    };

    const onVoiceResults = (e: any) => {
        const text = e.value;
        setQuery(text);
        fetchRecipes(text);
    };

    const onVoiceError = () => {
        setError('Voice recognition failed. Please try again.');
        setIsListening(false);
    };

    const startListening = async () => {
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
        try {
            await Voice.stop();
            await Voice.destroy();
            setIsListening(false);
        } catch (e) {
            console.error(e);
        }
    };

    const saveToShoppingList = async (recipe: Recipe) => {
        try {
            const storedRecipes = await AsyncStorage.getItem('shoppingList');
            const shoppingList = storedRecipes ? JSON.parse(storedRecipes) : [];
            const updatedList = [...shoppingList, recipe];
            await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedList));
            Alert.alert('Success', 'Recipe added to your shopping list.');
        } catch (error) {
            Alert.alert('Error', 'Sorry,failed to save recipe. Please try again.');
        }
    };

    const renderRecipiesItem: ListRenderItem<Recipe> = ({ item }) => (
        <View key={item.id} style={{ margin: 5 }}>
            <Image source={{ uri: item.image }} style={styles.imgStyle} />
            <Text style={{ color: 'red' }}>{item.title}</Text>
            <TouchableOpacity onPress={() => saveToShoppingList(item)} style={styles.saveBtnStyle}>
                <Text>Save Recipe</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <TextInput
                style={styles.textInputStyle}
                value={query}
                onChangeText={setQuery}
                placeholder="What do you want to eat today?"
                placeholderTextColor={'#000000'}
            />
            <View style={{ padding: 5 }}>
                <TouchableOpacity
                    onPress={() => fetchRecipes(query)}
                    style={styles.searchBtnStyle}
                >
                    <Text style={styles.btnText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={isListening ? stopListening : startListening}
                    style={styles.voiceBtnStyle}
                >
                    <Text style={styles.btnText}>{isListening ? 'Stop Voice Search' : 'Start Voice Search'}</Text>
                </TouchableOpacity>
            </View>

            {error ? <Text>{error}</Text> : null}
            <View style={styles.flatViewStyle}>
                <FlatList
                    data={recipes}
                    renderItem={renderRecipiesItem}
                    keyExtractor={(item) => item.id.toString()}
                />

            </View>

        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer:{ backgroundColor: '#000000', flex: 1 },
    textInputStyle :{ margin: 10, borderRadius: 8, padding: 10, backgroundColor: '#ffffff', color: '#000000' },
    searchBtnStyle:{ padding: 10, backgroundColor: 'red', alignItems: 'center', borderRadius: 8, margin: 10 },
    voiceBtnStyle:{ padding: 10, backgroundColor: 'blue', alignItems: 'center', borderRadius: 8, margin: 10 },
    btnText:{ fontWeight: '700' },
    flatViewStyle:{ backgroundColor: '#ffffff' },
    imgStyle:{ height: 100, width: 100 },
    saveBtnStyle:{ backgroundColor: 'blue', alignItems: 'center', padding: 10, marginTop: 5 }
  });
export default ChatbotScreen;
