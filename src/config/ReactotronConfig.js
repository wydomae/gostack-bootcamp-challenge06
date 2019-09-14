import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: 'INSERT YOUR IP ADDRESS HERE' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
