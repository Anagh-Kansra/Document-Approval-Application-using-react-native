import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../utils/Colors';
import Style from '../../utils/Style';
import { useNavigation } from '@react-navigation/native';

export default function HomeBox({ Category, number, nt, prop, fs }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(nt, prop)}
      activeOpacity={0.8}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={[Colors.GRADC1, Colors.GRADC2]}
          style={Style.HomeBox}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
              marginRight: 25,
              marginTop: 5,
            }}>
            <Text
              style={{ color: Colors.WHITE, fontSize: 20, fontWeight: '600' }}>
              {number}
            </Text>
          </View>
          <View>
            <Text
              style={[
                { color: Colors.WHITE, fontWeight: '600' },
                fs ? { fontSize: fs } : { fontSize: 30 },
              ]}>
              {Category}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
              marginRight: 10,
              marginBottom: 5,
            }}>
            <TouchableOpacity
              style={Style.arr}
              onPress={() => navigation.navigate(nt, prop)}
              activeOpacity={0.5}>
              <Icon name="arrow-right" size={22} color={Colors.BLACK} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}
