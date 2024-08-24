import {StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';

export default Style = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  innercontainer: {
    backgroundColor: Colors.BG_WHITE,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    height: 480,
    width: 350,
    alignItems: 'center',
  },
  innercontainer2: {
    backgroundColor: Colors.BG_WHITE,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    alignItems: 'center',
    color: Colors.BLACK,
    width: '85%',
    paddingLeft: 10,
  },
  innercontainer3: {
    backgroundColor: Colors.BG_WHITE,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    alignItems: 'center',
    color: Colors.BLACK,
    width: '55%',
    paddingLeft: 10,
  },
  outbox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    height: 40,
    marginBottom: 22,
  },
  box: {
    backgroundColor: Colors.ICON_BG,
    borderWidth: 1,
    borderColor: Colors.BLACK,
    width: '15%',
  },
  darkText: {
    color: Colors.BLACK,
    marginBottom: 20,
    fontSize: 15,
  },
  btn: {
    color: Colors.WHITE,
    fontSize: 17,
    fontWeight: '600',
    borderWidth: 1,
    backgroundColor: Colors.BLUE,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  Header: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  search: {
    height: 45,
    backgroundColor: Colors.SEARCHBG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  HomeBox: {
    width: '92%',
    paddingHorizontal: 3,
    overflow: 'hidden',
    height: 'auto',
    alignItems: 'center',
    margin: 'auto',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.BLACK,
    borderRadius: 15,
    marginBottom: 25,
  },
  arr: {
    backgroundColor: Colors.ARRBG,
    borderWidth: 1,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
  },
  listText: {
    color: Colors.BLACK,
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 20,
    borderWidth: 0.5,
    flex: 1,
  },
  tablehead: {
    flexDirection: 'row',
    backgroundColor: Colors.LiGHTGRAY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
