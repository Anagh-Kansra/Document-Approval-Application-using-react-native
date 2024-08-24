import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Style from '../../utils/Style';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function SecondaryHeader({ cp, tp, inav, nfun, bfun, prop }) {
  const navigation = useNavigation();
  return (
    <View style={[Style.Header, { justifyContent: 'flex-start', alignItems: 'center' }]}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.goBack()}
        style={{ paddingLeft: 20, width: '20%', position: 'absolute' }}
      >
        <Icon name="arrow-back" size={30} color={Colors.GRAY} />
      </TouchableOpacity>
      {inav === true ? (
        <View style={{ flexDirection: 'row', width: '100%', height: 70, alignItems: 'flex-end', justifyContent: 'center' }}>
          <TouchableOpacity onPress={bfun}>
            <Icon name="arrow-back" size={24} color={Colors.GRAY} />
          </TouchableOpacity>
          <Text style={{ color: Colors.BLACK, fontSize: 18, marginHorizontal: 25 }}>{cp}/{tp}</Text>
          <TouchableOpacity onPress={nfun}>
            <Icon name="arrow-forward" size={24} color={Colors.GRAY} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}