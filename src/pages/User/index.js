import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingContainer,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadMore();
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page, stars } = this.state;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      refreshing: false,
      page: page + 1,
    });
  };

  refreshList = async () => {
    this.setState(
      {
        stars: [],
        refreshing: true,
        page: 1,
      },
      this.loadMore
    );
  };

  handleNatigate = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading && page === 1 ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#7159c1" />
          </LoadingContainer>
        ) : (
          <>
            <Stars
              onEndReachedThreshold={0.2}
              /**
               * Line 102: avoid onEndReach being called multiple times if there are less than 30 items
               */
              onEndReached={stars.length >= 30 ? this.loadMore : null}
              onRefresh={this.refreshList}
              refreshing={refreshing}
              data={stars}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info onPress={() => this.handleNatigate(item)}>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          </>
        )}

        {loading && page !== 1 ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#7159c1" />
          </LoadingContainer>
        ) : null}
      </Container>
    );
  }
}
