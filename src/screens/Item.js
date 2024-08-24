import {ScrollView, View, BackHandler, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ItemForm from '../components/approvalDetails/ItemForm';
import SecondaryHeader from '../components/headers/SecondaryHeader';
import Orientation from 'react-native-orientation-locker';

export default function Item() {
  const navigation = useNavigation();
  const route = useRoute();
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
{/*
  useEffect(() => {
    // Unlock screen orientation when the component mounts
    Orientation.unlockAllOrientations();

    // Clean up the effect when the component unmounts
    return () => {
      Orientation.lockToPortrait(); // Lock orientation to portrait when component unmounts
    };
  }, []);
*/}

  return (
    <ScrollView>
      <SecondaryHeader />

      {/* Conditionally render the first ItemForm component */}
      {route.params.DocumentNo1 && route.params.Category1 && route.params.Item1 && (
        <View>
          <Text style={styles.text}>
            Items({route.params.NoOfItems})-
          </Text>
          <ItemForm
            DocumentNo={route.params.DocumentNo1}
            ApprovalCategory={route.params.Category1}
            Item={route.params.Item1}
            styles ={{borderWidth: 1, borderColor: 'black'}}
          />
        </View>
      )}

      {/* Conditionally render the second ItemForm component */}
      {route.params.DocumentNo2 && route.params.Category2 && route.params.Item2 && (
        <View>
          <Text style={styles.text}>
            Subitems({route.params.NoOfSubitems})-
          </Text>
          <ItemForm
            DocumentNo={route.params.DocumentNo2}
            ApprovalCategory={route.params.Category2}
            Item={route.params.Item2}
            styles ={{borderWidth: 1, borderColor: 'black'}}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    fontSize: 18,
    alignSelf: "center",
    color: 'black',
    fontWeight: 'bold'
  }
});
