import React from 'react';

import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const About = () => {
  const appVersion = "1.0.0";
  const developerName = "Empresa...";
  const contactEmail = "email@example.com";
  const githubLink = "https://github.com/seu-usuario/seu-repositorio";

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Sobre o Aplicativo</Text>

          <Text style={styles.paragraph}>
            Bem-vindo ao aplicativo de localização! Este aplicativo foi desenvolvido para ajudá-lo a gerenciar e visualizar pontos de interesse em um mapa, permitindo que você adicione novos locais, favorite-os e os busque por nome ou descrição.
          </Text>

          <Text style={styles.sectionTitle}>Versão</Text>
          <Text style={styles.paragraph}>Versão do aplicativo: {appVersion}</Text>

          <Text style={styles.sectionTitle}>Desenvolvimento</Text>
          <Text style={styles.paragraph}>Desenvolvido por: {developerName}</Text>

          <Text style={styles.sectionTitle}>Contato</Text>
          <View style={styles.contactContainer}>
            <Icon name="mail" size={20} color="#333" />
            <Text style={styles.contactText} onPress={() => openLink(`mailto:${contactEmail}`)}>
              {contactEmail}
            </Text>
          </View>
          {githubLink && (
            <View style={styles.contactContainer}>
              <Icon name="logo-github" size={20} color="#333" />
              <Text style={styles.contactText} onPress={() => openLink(githubLink)}>
                Visite nosso GitHub
              </Text>
            </View>
          )}

          <Text style={styles.footerText}>
            Esperamos que você aproveite a experiência!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 24,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    marginTop: 30,
    textAlign: 'center',
  },
});