import React from "react";
import { Link } from "react-router-dom";

class Detalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemon: null,
      evolution: null,
      filteredPokemonsIds: [],
      pokemonPositionOnArray: 0,
    };
  }

  componentDidMount() {
    const { filteredPokeList } = this.props;
    const id = Number(this.props.match.params.id);
    let filteredPokemonsIds = [];

    for (const _thisFilteredPokemon of filteredPokeList) {
      filteredPokemonsIds.push(_thisFilteredPokemon.id);
    }

    this.setState({ filteredPokemonsIds });
    this.selectPokemon(id);
  }

  selectFilteredPokemon = (action) => {
    const { pokemon, filteredPokemonsIds } = this.state;

    let activePokemon = Number(pokemon.id);
    let nextPokemon;

    activePokemon = filteredPokemonsIds.indexOf(activePokemon);

    if (action === "back") {
      nextPokemon = activePokemon - 1;
    } else {
      nextPokemon = activePokemon + 1;
    }

    nextPokemon = filteredPokemonsIds[nextPokemon];
    this.selectPokemon(nextPokemon);
  };

  selectPokemonOnEvolutionChain = (id) => {
    const { resetFilter } = this.props;

    resetFilter();
    this.selectPokemon(id);
  };

  selectPokemon = (id) => {
    const { pokeList, evolutions, filteredPokeList } = this.props;

    let filteredPokemonsIds = [];
    let pokemonPositionOnArray = 0;
  

    for (const _thisFilteredPokemon of filteredPokeList) {
      filteredPokemonsIds.push(_thisFilteredPokemon.id);
    }

    pokemonPositionOnArray = filteredPokemonsIds.indexOf(id);

    for (const _thisPokemon of pokeList) {
      if (_thisPokemon.id === id) {
        for (const _thisEvolution in evolutions) {
          if (_thisEvolution === _thisPokemon.name) {
            this.setState({
              pokemon: _thisPokemon,
              evolution: evolutions[_thisEvolution],
              filteredPokemonsIds,
              pokemonPositionOnArray,
            });
          }
        }
      }
    }
  };

  getCameFromPhoto = (evolvedPokemonId) => {
    const { pokeList } = this.props;

    for (const _thisPokemon of pokeList) {
      if (_thisPokemon.id === evolvedPokemonId) {
        return _thisPokemon.photo[2];
      }
    }
  };

  getWasBornPhoto = (evolvedPokemonId) => {
    const { pokeList } = this.props;
    for (const _thisPokemon of pokeList) {
      if (_thisPokemon.id === evolvedPokemonId) {
        return _thisPokemon.photo[2];
      }
    }
  };

  render() {
    const {
      pokemon,
      evolution,
    } = this.state;

    return (
      <div className="details__outer">
      
        {pokemon ? (
          <div className="details_inner">
            <p className="details__id">ID / {pokemon.id}</p>
            <div className="details__titleBar">
              <div className="details__evolutions details__evolutions-last">
                {evolution.to && evolution.to.lastEvolution && (
                  <Link
                    to={`${evolution.to.lastEvolution.id}`}
                    className="noLinkStyle"
                  >
                    <h3
                      className="details__name--evolution-to "
                      onClick={() =>
                        this.selectPokemonOnEvolutionChain(
                          evolution.to.lastEvolution.id
                        )
                      }
                    >
                      <img
                        className="details__evolution--photo"
                        src={this.getCameFromPhoto(
                          evolution.to.lastEvolution.id
                        )}
                        alt={evolution.to.lastEvolution.species}
                      />
                      {evolution.to.lastEvolution
                        ? evolution.to.lastEvolution.species
                            .charAt(0)
                            .toUpperCase() +
                          evolution.to.lastEvolution.species.substr(1)
                        : null}
                    </h3>
                  </Link>
                )}
              </div>
              <div className="details__evolutions">
                {evolution.to && (
                  <Link
                    to={`${evolution.to.evolvesTo.id}`}
                    className="noLinkStyle"
                  >
                    <h3
                      className="details__name--evolution-to"
                      onClick={() =>
                        this.selectPokemonOnEvolutionChain(
                          evolution.to.evolvesTo.id
                        )
                      }
                    >
                      <img
                        className="details__evolution--photo"
                        src={this.getCameFromPhoto(evolution.to.evolvesTo.id)}
                        alt={evolution.to.evolvesTo.species}
                      />
                      {evolution.to.evolvesTo
                        ? evolution.to.evolvesTo.species
                            .charAt(0)
                            .toUpperCase() +
                          evolution.to.evolvesTo.species.substr(1)
                        : null}
                    </h3>
                  </Link>
                )}
              </div>
              <div className="details__evolutions">
                <h2 className="details__name">
                  {pokemon.name.charAt(0).toUpperCase() +
                    pokemon.name.substr(1)}
                </h2>
              </div>
              <div className="details__evolutions">
                {evolution.from && (
                  <Link
                    to={`${evolution.from.proveniente.id}`}
                    className="noLinkStyle"
                  >
                    <h3
                      className="details__name--evolution"
                      onClick={() =>
                        this.selectPokemonOnEvolutionChain(
                          evolution.from.proveniente.id
                        )
                      }
                    >
                      {evolution.from.proveniente
                        ? evolution.from.proveniente.species
                            .charAt(0)
                            .toUpperCase() +
                          evolution.from.proveniente.species.substr(1)
                        : null}
                      <img
                        className="details__evolution--photo"
                        src={this.getCameFromPhoto(
                          evolution.from.proveniente.id
                        )}
                        alt={evolution.from.proveniente.species}
                      />
                    </h3>
                  </Link>
                )}
              </div>
              <div className="details__evolutions">
                {evolution.from && evolution.from.wasBorn && (
                  <Link
                    to={`${evolution.from.wasBorn.id}`}
                    className="noLinkStyle"
                  >
                    <h3
                      className="details__name--evolution"
                      onClick={() =>
                        this.selectPokemonOnEvolutionChain(
                          evolution.from.wasBorn.id
                        )
                      }
                    >
                      {evolution.from.wasBorn
                        ? evolution.from.wasBorn.species
                            .charAt(0)
                            .toUpperCase() +
                          evolution.from.wasBorn.species.substr(1)
                        : null}
                      <img
                        className="details__evolution--photo"
                        src={this.getWasBornPhoto(evolution.from.wasBorn.id)}
                        alt={evolution.from.wasBorn.species}
                      />
                    </h3>
                  </Link>
                )}
              </div>
            </div>
            <div className="details__sections--container">
              <div className="details__section">
                <div className="details__photos--container">
                  <img
                    className="details__photo details__photo-front"
                    src={pokemon.photo[0]}
                    alt={`${pokemon.name}`}
                  />
                  <img
                    className="details__photo"
                    src={pokemon.photo[1]}
                    alt={`${pokemon.name} (back)`}
                  />
                  <img
                    className="details__photo details__photo-front"
                    src={pokemon.photo[2]}
                    alt={`${pokemon.name} (alternative appearance)`}
                  />
                  <img
                    className="details__photo"
                    src={pokemon.photo[3]}
                    alt={`${pokemon.name} (back of alternative appearance)`}
                  />
                </div>
              </div>
          
              <div className="details__section">
                <p className="details__title">Altura:</p>{" "}
                <p className="details__text--physical">{pokemon.height} m</p>
                <p className="details__title">Peso:</p>{" "}
                <p className="details__text--physical">{pokemon.weight} kg</p>
              </div>
              <div className="details__section">
                <h3 className="details__title">Tipo: </h3>
                <ul className="details__types">
                  {pokemon.types.map((type) => (
                    <li className={`details__type type-${type}`} key={type}>
                      {type.toUpperCase()}
                    </li>
                  ))}
                </ul>
                <h3 className="details__title">Habilidades: </h3>
                <ul className="details__types">
                  {pokemon.abilities.map((type) => (
                    <li className="details__abilities" key={type}>
                      {type.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
        <Link to="/" className="noLinkStyle">
          <div className="details__goBack">Principal</div>
        </Link>
      </div>
    );
  }
}

export default Detalle;
