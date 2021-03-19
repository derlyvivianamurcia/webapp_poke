import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";

import Pokemon from "../pages/Pokemon";
const NUM_OF_POKEMONS = 30; 
const POKEMONS_URL = "https://pokeapi.co/api/v2/pokemon/"; 
const SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/"; 
let requestedPokemons = []; 
let requestedSpecies = []; 
let evolutionsData = [];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receivedData: false, 
      error: null, 
      pokeList: [], 
      evolutions: {}, 
      filteredPokeList: [], 
    };
  }

  componentDidMount() {
    this.catchPokemons();

    Promise.all(requestedPokemons) 
      .then((pokemonData) => {
        this.createPokemonObject(pokemonData);
      }) 
      .catch((error) => this.setState({ error })); 
    Promise.all(requestedSpecies) 
      .then((speciesData) => {
        this.manageSpecies(speciesData);
      }) 
      .catch((error) => this.setState({ error })); 
  }

  fetchData = (URI) => {
    return fetch(URI).then((response) => response.json());
  };

  catchPokemons = () => {
    for (let i = 1; i <= NUM_OF_POKEMONS; i++) {
      const QUERY = i;
      requestedPokemons.push(this.fetchData(`${POKEMONS_URL}${QUERY}/`)); 
      requestedSpecies.push(this.fetchData(`${SPECIES_URL}${QUERY}/`)); 
    }
  };

  createPokemonObject = (pokemonData) => {
    let pokeList = [];

    for (const pokemon of pokemonData) {
          let sprites = [];

      sprites.push(pokemon.sprites["front_default"]);
      sprites.push(pokemon.sprites["back_default"]);
      sprites.push(
        pokemon.sprites["front_shiny_female"] || pokemon.sprites["front_shiny"]
      );
      sprites.push(
        pokemon.sprites["back_shiny_female"] || pokemon.sprites["back_shiny"]
      );

      pokeList = [
        ...pokeList, 
        {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((typeObject) => typeObject.type.name),
          height: pokemon.height / 10,
          weight: pokemon.weight / 10,
          abilities: pokemon.abilities.map(
            (typeObject) => typeObject.ability.name
          ),
            photo: sprites,
        },
      ];
    }

    this.setState({
      filteredPokeList: pokeList,
      pokeList,
    });
  };

  manageSpecies = (speciesData) => {
    let evolutionChains = [];

    for (const _thisSpecies of speciesData) {
      evolutionChains.push(_thisSpecies.evolution_chain.url);
    }
    evolutionChains = [...new Set(evolutionChains)];
    this.catchEvolutions(evolutionChains);
  };

  catchEvolutions = (evolutionChains) => {
    let requestedEvolutions = []; 

    for (const URI of evolutionChains) {
      requestedEvolutions.push(this.fetchData(URI)); 
    }

    Promise.all(requestedEvolutions)
      .then((evolutionsData) => {
        this.createEvolutionsObject(evolutionsData);
      })
      .catch((error) => this.setState({ error }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pokeList !== this.state.pokeList) {
      this.createEvolutionsObject(evolutionsData);
    }
  }

  createEvolutionsObject = (evolutionsInfo) => {
    const { pokeList } = this.state;
    let evolutions = {};
    evolutionsData = evolutionsInfo;

    if (!pokeList) {
      return;
    }

    for (const evolution of evolutionsData) {
      const evolutionChain = evolution.chain;

      if (!evolutionChain.evolves_to[0]) {
        evolutions = { ...evolutions, [evolutionChain.species.name]: null };
      } else if (!evolutionChain.evolves_to[0].evolves_to[0]) {
        let cameFromId, evolvesToId;

        for (const _thisPokemon of pokeList) {
          if (_thisPokemon.name === evolutionChain.species.name) {
            cameFromId = _thisPokemon.id;
          }
          if (_thisPokemon.name === evolutionChain.evolves_to[0].species.name) {
            evolvesToId = _thisPokemon.id;
          }
        }

        evolutions = {
          ...evolutions,
          [evolutionChain.evolves_to[0].species.name]: {
            from: {
              proveniente: {
                id: cameFromId,
                species: evolutionChain.species.name,
              },
            },
            to: null,
          },
          [evolutionChain.species.name]: {
            from: null,
            to: {
              evolvesTo: {
                id: evolvesToId,
                species: evolutionChain.evolves_to[0].species.name,
              },
            },
          },
        };
      } else {
        let cameFromId, wasBornId, evolvesToId, lastEvolutionId;

        for (const _thisPokemon of pokeList) {
          if (_thisPokemon.name === evolutionChain.species.name) {
            wasBornId = _thisPokemon.id;
          }
          if (_thisPokemon.name === evolutionChain.evolves_to[0].species.name) {
            cameFromId = evolvesToId = _thisPokemon.id;
          }
          if (
            _thisPokemon.name ===
            evolutionChain.evolves_to[0].evolves_to[0].species.name
          ) {
            lastEvolutionId = _thisPokemon.id;
          }
        }
        evolutions = {
          ...evolutions,
          [evolutionChain.evolves_to[0].evolves_to[0].species.name]: {
            from: {
              proveniente: {
                id: cameFromId,
                species: evolutionChain.evolves_to[0].species.name,
              },
              wasBorn: {
                id: wasBornId,
                species: evolutionChain.species.name,
              },
            },
            to: null,
          },
          [evolutionChain.evolves_to[0].species.name]: {
            from: {
              proveniente: {
                id: wasBornId,
                species: evolutionChain.species.name,
              },
            },
            to: {
              evolvesTo: {
                id: lastEvolutionId,
                species:
                  evolutionChain.evolves_to[0].evolves_to[0].species.name,
              },
            },
          },
          [evolutionChain.species.name]: {
            from: null,
            to: {
              evolvesTo: {
                id: evolvesToId,
                species: evolutionChain.evolves_to[0].species.name,
              },
              lastEvolution: {
                id: lastEvolutionId,
                species:
                  evolutionChain.evolves_to[0].evolves_to[0].species.name,
              },
            },
          },
        };
      }
    }
    this.setState({
      receivedData: true,
      evolutions,
    });
  };



  render() {
    const {
      pokeList: myPokeList,
      filteredPokeList,
      evolutions,
    } = this.state; 

    return (
      <div className="App">
         <InfiniteScroll
      dataLength={myPokeList.length}
      next={evolutionsData}
        hasMore={true}
      loader={<div>Cargando</div>}
    >
        <Pokemon
          pokeList={myPokeList}
          evolutions={evolutions}
          filteredPokeList={filteredPokeList}
          resetFilter={this.resetFilter}
      
        />
          </InfiniteScroll>
      </div>

    );
  }
}

export default App;
