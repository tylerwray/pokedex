import React from "react";
import Axios from "axios";

import cache from "./lib/cache";
import Spinner from "../Spinner";

import "./Increment.css";

// const ALL_POKEMON_MAX_ID = 809;
const GEN_ONE_MAX_ID = 151;
const MAX_ID = GEN_ONE_MAX_ID;
const MIN_ID = 1;

export default class IncrementClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonId: MIN_ID,
      loading: true,
      data: {}
    };

    this.request = this.request.bind(this);
    this.getImageUrl = this.getImageUrl.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleRandom = this.handleRandom.bind(this);
  }

  componentDidMount() {
    this.request();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.pokemonId !== this.state.pokemonId) {
      this.request();
    }
  }

  request() {
    const { pokemonId } = this.state;

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    this.setState({
      loading: true
    });

    const cachedData = cache.get(url);

    if (cachedData) {
      this.setState({
        loading: false,
        data: cachedData
      });

      return;
    }

    Axios.get(url).then(({ data }) => {
      this.setState({
        loading: false,
        data
      });

      cache.set(url, data);
    });
  }

  getImageUrl() {
    const { pokemonId } = this.state;

    const formattedId = `00${pokemonId}`.slice(-3);
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${formattedId}.png`;
  }

  handlePrevious() {
    const { pokemonId } = this.state;

    if (pokemonId !== MIN_ID) {
      this.setState({
        pokemonId: pokemonId - 1
      });
    }
  }

  handleNext() {
    const { pokemonId } = this.state;

    if (pokemonId !== MAX_ID) {
      this.setState({
        pokemonId: pokemonId + 1
      });
    }
  }

  handleRandom() {
    const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID) + MIN_ID);

    this.setState({
      pokemonId: randomId
    });
  }

  render() {
    const { loading, data, pokemonId } = this.state;

    return (
      <div className="card">
        <div className="header">
          <div className="name">{!loading ? data.name : "・・・"}</div>
          <div className="pokemon-id">#{pokemonId}</div>
        </div>

        <div className="image">
          {loading ? (
            <Spinner />
          ) : (
            <img alt={data.name} src={this.getImageUrl(pokemonId)} />
          )}
        </div>
        <div className="buttons">
          <button className="previous" onClick={this.handlePrevious}>
            <span role="img" alt="arrow previous">
              ←{" "}
            </span>
            Prev
          </button>
          <button className="random" onClick={this.handleRandom}>
            Random
            <span role="img" alt="random">
              {" "}
              ♺
            </span>
          </button>
          <button className="next" onClick={this.handleNext}>
            Next
            <span role="img" alt="arrow next">
              {" "}
              →
            </span>
          </button>
        </div>
      </div>
    );
  }
}
