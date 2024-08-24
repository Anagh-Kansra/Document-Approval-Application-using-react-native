import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Style from '../../utils/Style';
import {useNavigation} from '@react-navigation/native';

export default function Row({item, prop}) {
  const navigation = useNavigation();
  console.log(prop);
  return (
    <View>
      <TouchableOpacity
        style={Style.row}
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('ApprovalDetail', prop);
        }}>
        <Text style={Style.listText}>{item.RequestorDept}</Text>
        <Text style={Style.listText}>{item.DocumentNo}</Text>
        <Text style={Style.listText}>{item.ApprovalValue}</Text>
      </TouchableOpacity>
    </View>
  );
}
