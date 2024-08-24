import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import Style from '../../utils/Style';
import {useNavigation} from '@react-navigation/native';

export default function Box({name, number, prop, nt, inCenter}) {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(nt, prop);
        }}
        activeOpacity={0.8}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={[Colors.GRADC1, Colors.GRADC2]}
            style={[
              Style.HomeBox,
              {
                flexDirection: 'row',
                height: 'auto',
                borderWidth: 0,
                width: '95%',
                marginBottom: 10,
              },
            ]}>
            <View
              style={[
                {
                  width: '88%',
                  height: 'auto',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingVertical: 28,
                  // paddingLeft: '12%',
                  // alignItems:'center'
                },
                inCenter
                  ? {paddingLeft: '12%', alignItems: 'center'}
                  : {paddingLeft: 15, alignItems: 'flex-start'},
              ]}>
              <Text
                style={{color: Colors.WHITE, fontSize: 22, fontWeight: 600}}>
                {name}
              </Text>
            </View>
            <View
              style={{
                width: '12%',
                height: 'auto',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingRight: 15,
                paddingTop: 45,
              }}>
              <Text
                style={{color: Colors.WHITE, fontSize: 18, fontWeight: 500}}>
                {number}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
}
