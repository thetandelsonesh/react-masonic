import React, { Component } from 'react';
import { Masonry } from "masonic";
import { css, ThemeProvider, Box, Type, Button } from "curls";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const heights = {};
const getHeight = id => {
  if (heights[id] === void 0) heights[id] = getRandomInt(240, 640);
  return heights[id];
};

const transition = css`
  will-change: height;
  transform: translateZ(0);
  transition-property: height;
  transition-timing: ease-in-out;
  transition-duration: 200ms;
`;

class FakeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.data.id !== 0 && getHeight(props.data.id)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.width !== this.props.width ||
      nextState.height !== this.state.height
    );
  }

  render() {
    return (
      <Box
        flex
        column
        bg="black"
        bw="0"
        br="3"
        justify="center"
        align="center"
        style={{ height: this.state.height }}
        css={transition}
      >
        <Type size="lg" color="white" children={this.props.index} />

        {this.props.data.id === 0 && (
          <Box
            as="img"
            d="block"
            width="100%"
            br="b3"
            src="https://www.pets4homes.co.uk/images/articles/771/large/cat-lifespan-the-life-expectancy-of-cats-568e40723c336.jpg"
          />
        )}

        {this.props.index !== 0 && (
          <Button
            bc="white"
            m="y3"
            onClick={() =>
              this.setState({
                height: this.state.height + getRandomInt(24, 96)
              })
            }
          >
            <Type color="white">Size me up</Type>
          </Button>
        )}
      </Box>
    );
  }
}

class Home extends Component{


  constructor(props) {
    super(props);
    this.state = {
      list : []
    }
  }

  componentWillMount() {
    this.getList();
  }

  getList = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const {list} = this.state;
        const newList = [...list, ...data];
        this.setState({
          list: newList
        })
    })
  }

  render() {

    const { list } = this.state;

    return (
      <React.unstable_ConcurrentMode>
        <ThemeProvider>
          <Masonry
            items={list}
            itemKey={data => data.id}
            itemHeightEstimate={440}
            columnWidth={160}
            columnGutter={8}
            overscanBy={2}
            render={FakeCard}
          />
        </ThemeProvider>

        <button onClick={this.getList}>Load More</button>
      </React.unstable_ConcurrentMode>
    );
  }
}

export default Home