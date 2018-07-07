import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';

import { connect } from 'react-redux';

import { login } from './redux';

let Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    // дополнительные состояния:
    // 1 - показана клавиатура или нет.
    // будем на основе этого видоизменять экран для лучшего user experience
    // особенно на маленьких экранах
    // 2 - режим ориентации экрана, чтобы более-меннее не уродливо отобразить содержимое
    // в альбомной ориентации
    this.state = {
      login: '',
      password: '',
      keyboardShown: false,
      landScapeMode: false,
    }
  }

  // определение ориентации
  detectOrientation(){
    if(Dimensions.get('window').width > Dimensions.get('window').height) {
      this.setState({
        landScapeMode : true,
      });
    }
    else {
      this.setState({
        landScapeMode : false,
      });
    }
  }

  // обработчики событий клавиатуры
  componentDidMount () {
    this.detectOrientation();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    this.setState({
      keyboardShown: true,
    });
  }

  _keyboardDidHide () {
    this.setState({
      keyboardShown: false,
    });
  }

  _onLogin () {
    this.props.login(this.state.login, this.state.password).then(result => {
      alert(JSON.stringify(result.payload.data));
      // действия после логина
      Keyboard.dismiss();
    }).catch((error) => {
      alert(error)
    });
  }

  render() {
    const {
      loading
    } = this.props;

    // для изменения значений ширины элементов при изменении ориентации
    const elemWidth = Screen.width * 0.9;
    const picStyle = {
      edge: Screen.width * 0.5,
      radius: Screen.width * 0.25,
    };

    return (
      <View
        style={styles.container}
        onLayout={() => {
          this.detectOrientation();
          Screen.width = Dimensions.get('window').width;
          Screen.height = Dimensions.get('window').height;
          this.forceUpdate();
        }}
      >
        {/*Экран разбит на 2 части - верхняя (картинка с названием) и нижняя (форма логина)*/}
        {/*Когда клавиатуры нет - занимают по пол-экрана, когда есть (или альбомная ориентация) - верхний блок перестает быть flex, имеет просто отступ сверху*/}
        {/*тем самым освобождая форме логина больше места*/}
        {/*Картинку убираем, когда показана клавиатура или когда альбомная ориентация*/}
        <View style={[styles.topContainer, this.state.keyboardShown || this.state.landScapeMode ? styles.topContainerWithKeyboard : styles.topContainerWithNoKeyboard]}>
          {!this.state.keyboardShown && !this.state.landScapeMode ?
            <Image
              style={{
                height: picStyle.edge,
                width: picStyle.edge,
                borderRadius: picStyle.radius,
              }}
              source={require('./img/img.jpg')} /> :
            null
          }
          <Text style={styles.titleText}>
            Nature inc.
          </Text>
        </View>


        <KeyboardAvoidingView
          style={styles.bottomContainer}
          behavior="padding"
          enabled
        >
          {/*Форма логина сделана прокручиваемой, т.к. на мелких экранах она не поместится вся вместе с клавиатурой*/}
          {/*Расчитываем, что когда клавиатуры нет, форма поместится полностью*/}
          {/*Форма прижимается к низу экрана*/}
          <ScrollView
            contentContainerStyle={{alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1}}
            keyboardShouldPersistTaps={'always'}
            scrollEnabled={this.state.keyboardShown}
          >

            <View style={{height: 10}} />

            <TextInput
              style={[styles.input, {width: elemWidth}]}
              placeholder="Логин"
              selectionColor={themeColor}
              keyboardType="email-address"
              value={this.state.login}
              onChangeText={login => this.setState({login})}
              underlineColorAndroid='rgba(0,0,0,0)'
            />

            <View style={{height: 20}} />

            <TextInput
              style={[styles.input, {width: elemWidth}]}
              placeholder="Пароль"
              selectionColor={themeColor}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              underlineColorAndroid='rgba(0,0,0,0)'
            />

            <View style={{height: 30}} />

            {/*Кнопка в виде TouchableOpacity, когда не активна - серого цвета*/}
            <TouchableOpacity
              style={[styles.button, loading ? styles.buttonDisabled : styles.buttonActive, {width: elemWidth}]}
              onPress={this._onLogin.bind(this)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                Войти
              </Text>
            </TouchableOpacity>

            <View style={{height: 30}} />

            <Text style={styles.commonText}>
              Нажимая войти вы подтверждаете ознакомление с
              <Text style={styles.markedText}>
                {' '}пользовательским соглашением.
              </Text>
            </Text>

            <View style={{height: 30}} />

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const themeColor = 'rgb(255, 51, 153)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainerWithKeyboard: {
    paddingTop: 50,
  },
  topContainerWithNoKeyboard: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  input: {
    paddingLeft: 20,
    height: 40,
    borderColor: themeColor,
    backgroundColor:'transparent',
    borderWidth: 2,
    borderStyle: 'solid',
    fontSize:15,
    borderRadius: 25,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    backgroundColor: themeColor,
  },
  buttonActive: {
    backgroundColor: themeColor,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  commonText: {
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
  },
  titleText: {
    fontSize: 25,
  },
  markedText: {
    color: themeColor,
  },
});

const mapStateToProps = state => {
  return {
    loginData: state.loginData,
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = {
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
