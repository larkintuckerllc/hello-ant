import React, { Component } from 'react';
import { Button } from 'antd';
import asyncComponent from '../asyncComponent';

const Cat = asyncComponent(() => import('./Cat'));
const Dog = asyncComponent(() => import('./Dog'));
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: null,
    };
  }
  // FYI: NOT BEST PRACTICE TO DEFINE FUNCTIONS IN RENDER METHOD
  // SHOULD PULL OUT BUTTONS INTO COMPONENTS TO SOLVE
  render() {
    const { showing } = this.state;
    return (
      <div>
        <div>
          <Button
            type="primary"
            onClick={() => { this.setState({ showing: 'cat' }); }}
          >cat
          </Button>
          <Button
            type="primary"
            onClick={() => { this.setState({ showing: 'dog' }); }}
          >dog
          </Button>
        </div>
        { showing === 'cat' && <Cat />}
        { showing === 'dog' && <Dog />}
      </div>
    );
  }
}
export default App;
