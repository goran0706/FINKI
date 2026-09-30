/**
 * Immutable Object State
 * ======================
 *
 * In React, state objects should be treated as strictly immutable. Although JavaScript allows mutating
 * object properties directly, mutating state objects bypasses React's change detection and causes UI
 * rendering bugs, stale UI snapshots, and broken component lifecycle optimization.
 *
 * To update state objects correctly, create a new object reference containing updated values alongside
 * copied unchanged properties. Updating deeply nested state requires creating copies at every level of
 * nesting that was modified to maintain structural immutability and trigger re-renders cleanly.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Artwork {
  readonly title: string;
  readonly city: string;
}

export interface Artist {
  readonly name: string;
  readonly artwork: Artwork;
}

export interface ImmutableObjectProps {
  readonly initialArtist: Artist;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const NestedImmutability: React.FC<ImmutableObjectProps> = ({ initialArtist }) => {
  const [artist, setArtist] = useState<Artist>(initialArtist);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Shallow copy top-level object with spread operator
    setArtist((prevArtist) => ({
      ...prevArtist,
      name: event.target.value,
    }));
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Copy both top-level artist object and nested artwork object
    setArtist((prevArtist) => ({
      ...prevArtist,
      artwork: {
        ...prevArtist.artwork,
        city: event.target.value,
      },
    }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Copy top-level and nested structures while maintaining immutability
    setArtist((prevArtist) => ({
      ...prevArtist,
      artwork: {
        ...prevArtist.artwork,
        title: event.target.value,
      },
    }));
  };

  return (
    <div>
      <p>
        Artist: {artist.name} | Work: "{artist.artwork.title}" ({artist.artwork.city})
      </p>

      <label htmlFor="artist-name">Artist Name: </label>
      <input id="artist-name" type="text" value={artist.name} onChange={handleNameChange} />

      <br />

      <label htmlFor="artwork-title">Artwork Title: </label>
      <input id="artwork-title" type="text" value={artist.artwork.title} onChange={handleTitleChange} />

      <br />

      <label htmlFor="artwork-city">City: </label>
      <input id="artwork-city" type="text" value={artist.artwork.city} onChange={handleCityChange} />
    </div>
  );
};

export const DirectMutationViolation: React.FC<ImmutableObjectProps> = ({ initialArtist }) => {
  const [artist, setArtist] = useState<Artist>(initialArtist);

  const handleIncorrectMutation = (): void => {
    // BAD PRACTICE: Direct property mutation modifies object in place without changing reference
    // React's Object.is comparison sees same object reference and fails to re-render UI
    const mutableArtist = artist as { name: string; artwork: Artwork };
    mutableArtist.name = "Mutated Direct (No Render)";
    setArtist(artist);
  };

  const handleCorrectImmutability = (): void => {
    // GOOD PRACTICE: Returning a brand new object reference triggers React render pass
    setArtist({
      ...artist,
      name: "Updated Immutably (Triggers Render)",
    });
  };

  return (
    <div>
      <p>Artist Name: {artist.name}</p>
      <button type="button" onClick={handleIncorrectMutation}>
        Attempt Direct Mutation (Broken)
      </button>
      <button type="button" onClick={handleCorrectImmutability}>
        Apply Immutable Update (Correct)
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ImmutableObjectStateContainer: React.FC = () => {
  const defaultArtist: Artist = {
    name: "Niki de Saint Phalle",
    artwork: {
      title: "Le Cyclop",
      city: "Milly-la-Forêt",
    },
  };

  return (
    <div>
      <h1>14 - Immutable Object State</h1>

      <h2>1. Safe Nested Object State Copying</h2>
      <NestedImmutability initialArtist={defaultArtist} />

      <h2>2. Direct Mutation vs. Immutable Reference Update</h2>
      <DirectMutationViolation initialArtist={defaultArtist} />
    </div>
  );
};

export default ImmutableObjectStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State objects in React are read-only structures and should never be mutated in place directly.
// - Object property mutations skip Object.is identity checks and fail to trigger re-renders.
// - Creating shallow copies using spread syntax preserves unchanged fields while updating targeted properties.
// - Updating nested properties requires spreading every level of object nesting up to the state root.
// - Supplying fresh object references guarantees reliable state updates and consistent UI renderings.
