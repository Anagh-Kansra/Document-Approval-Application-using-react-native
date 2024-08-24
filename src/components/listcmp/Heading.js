import {View, Text} from 'react-native';
import React from 'react';
import Style from '../../utils/Style';

export default function Heading({item}) {
  return (
    <View style={Style.tablehead}>
      <Text style={[Style.listText, {fontWeight: 600, paddingVertical: 8}]}>
        {item.dep}
      </Text>
      <Text style={[Style.listText, {fontWeight: 600, paddingVertical: 8}]}>
        {item.number}
      </Text>
      <Text style={[Style.listText, {fontWeight: 600, paddingVertical: 8}]}>
        {item.value}
      </Text>
    </View>
  );
}
