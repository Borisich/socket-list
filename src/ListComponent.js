import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

const io = require('socket.io-client');

const socket = socket = io('http://190.115.24.50:19002', {
  transports: ['websocket'],
});

class ListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: false,
      expId: null,
      list: [],
    }
  }

  componentDidMount() {
    socket.on('sport-list', data => {
      this.setState({
        list: data,
      })
    });

    socket.on('get-sport', res => {
      const item = this.state.list.find(e => e.id === res.meta.id);
      if (item) {
        item.data = res.response;
        this.setState({
          refresh: !this.state.refresh,
        });
      }
    });
  }

  _getData(id) {
    if (this.state.expId !== id) {
      socket.emit('get-sport', {id: id});
    }

    this.setState({
      refresh: !this.state.refresh,
      expId: this.state.expId === id ? null : id,
    });
  }

  renderExpanded(item) {
    if (item.id === this.state.expId) {
      return item.data
        ?
        <ScrollView
          contentContainerStyle={styles.content}
        >
          {item.data.map((d, i) => <Text key={`t-${i}`}>{d}</Text>)}
        </ScrollView>
        :
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.list.length === 0
          ?
          <Text style={styles.headerText}>Loading...</Text>
          :
          <FlatList
            data={this.state.list}
            extraData={this.state.refresh}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity
                  onPress={this._getData.bind(this, item.id )}
                >
                  <Text style={styles.headerText}>{item.name}</Text>
                </TouchableOpacity>

                {this.renderExpanded(item)}

              </View>
            )}
            keyExtractor={(item, index) => `k-${index}`}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 30,
  },
  content: {
    paddingLeft: 20,
  },
  contentText: {
    fontSize: 20,
  },
});

export default ListComponent;
