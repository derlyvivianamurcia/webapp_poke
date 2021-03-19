import React from "react";
import { Link } from "react-router-dom";

const Personaje = ({ pokemon, evolutions }) => {
  const { name, photo, types, id } = pokemon;
  let proveniente;

  const colors = {
    bug: '#f8d5a3',
    electric: '#7a4a66',
    dark: '#044286',
    dragon: '#97b3e6',
    fairy: '#fceaff',
    fighting: '#E6E0D4',
    fire: '#FDDFDF',
    flying: '#F5F5F5',
    ghost: '#663388',
    grass: '#DEFDE0',
    ground: '#f4e7da',
    ice: '#DEF3FD',
    normal: '#8b856b',
    poison: '#98d7a5',
    psychic: '#eaeda1',
    rock: '#d5d5d4',
    steel: 'gray',
    water: '#DEF3FD',
  }

  for (let _thisPokemon in evolutions) {
    if (_thisPokemon === name && evolutions[_thisPokemon].from) {
      proveniente = evolutions[_thisPokemon].from.proveniente.species;
    }
  }

  return (
    <Link to={`pokemon/${id}`} className="noLinkStyle">
            

      <div className="pokemon__card" style={{backgroundColor: colors[types] }}>
        <img src={photo[0]} className="pokemon__photo" alt={name} />
        <p className="pokemon__id">{id}</p>
        <h2 className="pokemon__name">
          {name.charAt(0).toUpperCase() + name.substr(1)}
        </h2>
        <ul className="pokemon__types">
          {types.map((type) => (
            <li className={`pokemon__type type-${type}`} key={type}>
              {type.toUpperCase()}
            </li>
          ))}
        </ul>
        <div
          className={`pokemon__bottom ${proveniente ? "pokemon__origin" : ""}`}
        >
          <p className="text_Evolution">
            {proveniente ? `Evolución de:` : null}
          </p>
          <p className="pokemon__origin--pokemon">
            {proveniente
              ? proveniente.charAt(0).toUpperCase() + proveniente.substr(1)
              : null}
          </p>
        </div>
      </div>
  
    </Link>
  );
};

export default Personaje;
