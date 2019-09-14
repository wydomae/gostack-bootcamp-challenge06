import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: 'ENTER YOUR IP ADDRESS' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
