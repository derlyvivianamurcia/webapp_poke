import React from "react";
import Personaje from "./Personaje";

const PersonajesList = ({
  evolutions,
  filteredPokeList,
}) => {
  return (
    <section className="section__main">
        <ul className="main__list-container">
          {filteredPokeList.map((pokemon) => {
            return (
              <li className="list-element" key={pokemon.id}>
                <Personaje pokemon={pokemon} evolutions={evolutions} />
              </li>
            );
          })}
        </ul>
      )
    </section>
  );
};

export default PersonajesList;
