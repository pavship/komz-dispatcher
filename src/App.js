import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { Grid, Segment, Rail, Sticky, Item } from 'semantic-ui-react'
import NavBar from './components/NavBar'


class App extends Component {
  state = {}
  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const { contextRef } = this.state
    return (
      <Fragment>
        <NavBar></NavBar>
        <Grid columns={2} divided>
          <Grid.Column>
            <div ref={this.handleContextRef}>
              <Segment>
                <Item.Group divided>
                  {_.times(18, i => (
                    <Item key={i}>
                      <Item.Content>
                        <Item.Header as='a'>Followup Article</Item.Header>
                        <Item.Meta>By Author</Item.Meta>
                      </Item.Content>
                    </Item>
                  ))}
                </Item.Group>
              </Segment>
            </div>
          </Grid.Column>
          <Grid.Column>
            <Rail position='right'>
              <Sticky context={contextRef} scrollContext={window} offset={54} >
                <Item.Header as='a'>Followup Article</Item.Header>
                <Item.Meta>By Author</Item.Meta>
              </Sticky>
            </Rail>
          </Grid.Column>
        </Grid>
      </Fragment>
    );
  }
}

export default App;
