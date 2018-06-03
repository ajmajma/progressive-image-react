import React, { Component } from "react";
import PropTypes from "prop-types";

import { VelocityTransitionGroup } from "velocity-react";

require("./progressive-image.scss");

export default class FollainProgressiveImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      image: props.smallImg
    };

    this.loadImage = this.loadImage.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);

    this._mounted = false;
  }

  componentWillMount() {
    const { largeImg } = this.props;
    this.loadImage(largeImg);
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUpdate(nextProps) {
    const { largeImg, smallImg } = nextProps;

    if (largeImg !== this.props.largeImg) {
      this.setState({ loaded: false, image: smallImg }, () => {
        this.loadImage(largeImg);
      });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onError(err) {
    console.warn("Error loading progressive image :", err);
  }

  onLoad() {
    if (this._mounted) {
      this.setState({
        loaded: true,
        image: this.image.src
      });
    }
  }

  loadImage(src) {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }

    const image = new Image();
    this.image = image;
    image.onload = this.onLoad;
    image.onerror = this.onError;
    image.src = src;
  }

  render() {
    const imgStyle = { paddingBottom: this.props.heightRatio };
    const { imgAlt, imgTitle } = this.props;

    return (
      <div
        className={`progressive-placeholder ${
          this.state.loaded ? "loaded" : ""
        }`}
      >
        <VelocityTransitionGroup
          enter={{ animation: "transition.fadeIn", duration: 100 }}
        >
          {this.state.loaded && (
            <img
              key={imgTitle}
              alt={imgAlt}
              className={`loaded`}
              src={this.state.image}
              title={imgTitle}
            />
          )}

          {!this.state.loaded && <div key={imgTitle} />}
        </VelocityTransitionGroup>

        <img
          className={`img-small ${!this.state.loaded ? "loaded" : ""}`}
          src={this.state.image}
          alt="placeholder image for loading"
        />
        <div style={imgStyle} />
      </div>
    );
  }
}

FollainProgressiveImage.displayName = "FollainProgressiveImage";

FollainProgressiveImage.propTypes = {
  bgColor: PropTypes.string,
  heightRatio: PropTypes.string.isRequired,
  largeImg: PropTypes.string.isRequired,
  smallImg: PropTypes.string.isRequired,
  imgAlt: PropTypes.string,
  imgTitle: PropTypes.string
};
