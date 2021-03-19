import React from "react";
import { Route, Switch } from "react-router-dom";
import PersonajesList from "../components/PersonajesList";
import Detalle from "./Detalle";
import Header from "../components/Header";
import "../styles/Header.css";


const Pokemon = ({
  pokeList,
  evolutions,
  resetFilter,
  filteredPokeList,
}) => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <React.Fragment>
            <Header />
              <PersonajesList
              pokeList={pokeList}
              evolutions={evolutions}
              filteredPokeList={filteredPokeList}
            />
          </React.Fragment>
        )}
      />
      <Route
        path="/pokemon/:id"
        render={(props) => (
          <Detalle
            match={props.match}
            pokeList={pokeList}
            evolutions={evolutions}
            filteredPokeList={filteredPokeList}
            resetFilter={resetFilter}
          />
        )}
      />
    </Switch>
  );
};

export default Pokemon;
