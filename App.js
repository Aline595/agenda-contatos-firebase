import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Button, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import ENV from './env';
import * as firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length)
  firebase.initializeApp(ENV);

const db = firebase.firestore();

export default function App() {

  const [contatos, setContatos] = useState ([]);
  const [nomeContato, setNomeContato] = useState('');
  const [numeroContato, setNumeroContato] = useState('');

  const capturarNomeContato = (nomeContato) => {
    setNomeContato(nomeContato);
  }
  const capturarNumeroContato = (numeroContato) => {
    setNumeroContato(numeroContato);
  }

  const removerContato = (chave) =>{
    Alert.alert(
      'Apagar ?', 
      'Quer mesmo apagar esse contato?', 
      [
        {text: 'Cancelar'},
        {text: 'Confirmar', onPress:() => db.collection('contatos').doc(chave).delete()}
      ]
    ); 
  }

  const adicionarContato = (contato) => {
    db.collection('contatos').add({
      texto: contato[0],
      numero: contato[1]
    });
  }
  useEffect(() => {
    db.collection('contatos').onSnapshot(snapshot => {
      let aux = [];
      snapshot.forEach(doc => {
        aux.push({
          numero: doc.data().numero,
          texto: doc.data().texto,
          chave: doc.id,
        })
      });
      setContatos(aux);
    });
  }, []);


  return (
    <View style={estilos.telaPrincipalView}>
      <View style={estilos.lembreteView}>
        <View style={estilos.textoEInput}>
          <Text style={estilos.text}>Nome:    </Text>
          <TextInput 
            placeholder="Nome Sobrenome"
            style={estilos.contatoTextInput}
            onChangeText={capturarNomeContato}
            value={nomeContato}
          />
        </View>

        <View style={estilos.textoEInput}>
          <Text>Numero:</Text>
          <TextInput 
            placeholder="(11) 91111-1111"
            style={estilos.contatoTextInput}
            onChangeText={capturarNumeroContato}
            value={numeroContato}
          />
        </View>

        <Button 
          title="inserir"
          color="#2bb140"
          onPress={() => {
            adicionarContato([nomeContato, numeroContato])
          }}
        />
      </View>
    <View>
      <FlatList 
        data={contatos}
        renderItem={
          contato => (
            <TouchableOpacity onLongPress={() => removerContato(contato.item.chave)}>
              <View style={estilos.contatoNaLista}>
                  <Text style={estilos.textoDaLista}>{contato.item.texto} : {contato.item.numero}</Text>
              </View>
            </TouchableOpacity>
          )
        }
      />   
    </View>
  </View>
);
}

const estilos = StyleSheet.create({
  entradaView: {
    marginBottom: 8

  },
  itemNaListaView: {
    padding: 12,
    backgroundColor: '#CCC',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 8
  },
  lembreteTextInput: { 
    borderBottomColor: 'black', 
    borderBottomWidth: 1, 
    marginBottom: 4, 
    padding: 8, 
    textAlign: 'center' 
  },
  telaPrincipalView: {
    padding: 50,
    flex:1,
    backgroundColor: '#f0f0f7'
  },

  lembreteView: {
    marginBottom: 5
  },
  text:{
    
  },
  contatoTextInput: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 2,
    flex: 1,
    paddingLeft: 10,
    marginLeft: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  textoEInput: {
    marginBottom: 5,
    flexDirection:'row', 
    alignItems:"center",
  },

  contatoNaLista: {
    padding: 12,
    backgroundColor: '#CAD8E0',
    marginBottom: 8,
    borderRadius: 8
  }
});