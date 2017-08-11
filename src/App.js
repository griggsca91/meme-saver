import React, { Component } from 'react';
import './App.css';
import BigBooty from 'superagent'; 
import  {Config} from './Config.js';

function getRandomTag() {
  let randomIndex = Math.floor(Math.random() * (Config.tags.length));
  return Config.tags[randomIndex];
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gifURL: "",
      style: {
        position: "absolute",
        top: 0,
        right: 0,
      },
      goingDown: true,
      goingLeft: true
    };    


    this.getRandomGIF = this.getRandomGIF.bind(this);
    this.getRandomGIF();
    this.animateIMG = this.animateIMG.bind(this);
    setInterval(this.animateIMG, 50);
    setInterval(this.getRandomGIF, Config.interval*1000);
  }


  getRandomGIF() {

    let randomTag = encodeURI(getRandomTag());
    console.log("Getting gif with random tag: ", randomTag);

    let url = `https://api.giphy.com/v1/gifs/random?` +
          `api_key=${Config.giphyAPI}` +
          `&rating=g` +
          `&tag=${randomTag}`;

      BigBooty.get(url).end((err, res) => {
        console.log( res.body.data.image_url)
          this.setState({
            gifURL: res.body.data.image_url
          });
      });


  }


  animateIMG() {

    this.img = document.getElementById("stupid");
    this.setState((prevState) => {



      let top = prevState.style.top;
      let right = prevState.style.right;

      let goingDown = prevState.goingDown;
      let goingLeft = prevState.goingLeft;

      if (goingDown) {
        goingDown = window.innerHeight >= this.img.getBoundingClientRect().bottom;
        top = top + 5;
      }
      else {
        goingDown = 0 > this.img.getBoundingClientRect().top;
        top = top - 5;
      }

      if (goingLeft) {
        goingLeft = 0 < this.img.getBoundingClientRect().left;
        right = right + 5;
      }
      else {
        goingLeft = window.innerWidth < this.img.getBoundingClientRect().right;
        right = right - 5;
      }


      let style = {...prevState.style, 
        top: top,
        right: right,
      };

      return {
        style: style,
        goingDown: goingDown,
        goingLeft: goingLeft
      };

    });
  }



  render() {
    return (
      <div className="App">
        <img id="stupid" style={this.state.style} src={this.state.gifURL} />
      </div>
    );
  }
}

export default App;
