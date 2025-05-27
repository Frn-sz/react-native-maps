import { StyleSheet } from 'react-native';

import { TabBar } from './components/Tab';

export default function App() {
  return (
    <>
      <TabBar></TabBar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
