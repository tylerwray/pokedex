import React, { useState } from "react";

import useCachedRequest from "./hooks/useCachedRequest";
import Spinner from "../Spinner";

import "./Increment.css";

const ALL_POKEMON_MAX_ID = 809;
const GEN_ONE_MAX_ID = 151;
const MAX_ID = GEN_ONE_MAX_ID;
const MIN_ID = 1;

export default function Increment() {
  const [pokemonId, setPokemonId] = useState(MIN_ID);

  const { data, loading } = useCachedRequest(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );

  function handlePrevious() {
    if (pokemonId !== MIN_ID) {
      setPokemonId(pokemonId - 1);
    }
  }

  function handleNext() {
    if (pokemonId !== MAX_ID) {
      setPokemonId(pokemonId + 1);
    }
  }

  function handleRandom() {
    const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID) + MIN_ID);

    setPokemonId(randomId);
  }

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
          <img alt={data.name} src={getImageUrl(pokemonId)} />
        )}
      </div>
      <div className="buttons">
        <button className="previous" onClick={handlePrevious}>
          <span role="img" alt="arrow previous">
            ←{" "}
          </span>
          Prev
        </button>
        <button className="random" onClick={handleRandom}>
          Random
          <span role="img" alt="random">
            {" "}
            ♺
          </span>
        </button>
        <button className="next" onClick={handleNext}>
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

function getImageUrl(pokemonId) {
  const formattedId = `00${pokemonId}`.slice(-3);
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${formattedId}.png`;
}
