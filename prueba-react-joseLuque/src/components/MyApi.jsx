import React, { useState, useEffect } from 'react';
import Buscador from './Buscador';

function MyApi() {
    const [birds, setBirds] = useState([]); 
    const [selectedBird, setSelectedBird] = useState(null); 
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        queryApi();
    }, []);

    const queryApi = async () => {
        const url = 'https://aves.ninjas.cl/api/birds';
        const response = await fetch(url);
        const data = await response.json();
        const sortedBirds = data.sort((a, b) => a.name.spanish.localeCompare(b.name.spanish));
        setBirds(sortedBirds);
    };
    const handleBirdClick = async (bird) => {
        const response = await fetch(bird._links.self);
        const birdDetails = await response.json();
        setSelectedBird(birdDetails);
    };
    const handleSearch = (text) => {
        setSearchText(text);
    };
    const groupBirdsByInitialLetter = () => {
        const groupedBirds = {};

        const filteredBirds = birds.filter((bird) => {
            const birdName = bird.name.spanish.toLowerCase();
            const firstLetter = searchText.toLowerCase();
            return birdName.startsWith(firstLetter);
        });

        filteredBirds.forEach((bird) => {
            const initialLetter = bird.name.spanish[0].toUpperCase();

            if (!groupedBirds[initialLetter]) {
                groupedBirds[initialLetter] = [];
            }

            groupedBirds[initialLetter].push(bird);
        });

        return groupedBirds;
    };

    const groupedBirds = groupBirdsByInitialLetter();

    return (
        <div className='container-app'> 
            <div className='birdList'>
                <Buscador searchText={ searchText } onSearch={ handleSearch } birds = { birds } />
                <div className='index-list'>
                    {Object.keys(groupedBirds).map((initialLetter) => (
                        <div key={ initialLetter }>
                            <h2>{ initialLetter }</h2>
                            <ul>
                                {groupedBirds[initialLetter].map((bird) => (
                                    <li key = { bird.uid } onClick={() => handleBirdClick(bird)}>
                                        { bird.name.spanish }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className='information-bird'>
                {selectedBird && (
                    <div className='card mb-3'>
                        <div className='row g-0'>
                            <div className='col-md-4'>
                                {selectedBird.images && (
                                    <img
                                        className='img-fluid rounded-start'
                                        src={ selectedBird.images.main }
                                        alt={ selectedBird.name.spanish }
                                    />
                                )}
                            </div>
                            <div className='col-md-8'>
                                <div className='card-body'>
                                    <h2 className='card-title'> Información del Ave</h2>
                                    <h4 className='card-title'>{ selectedBird.name.spanish }</h4>
                                    <p className='card-text'>
                                        <strong>Hábitat:</strong>{' '}
                                        { selectedBird.habitat ? selectedBird.habitat : 'No disponible' }
                                    </p>
                                    <p className='card-text'>
                                        <strong>Order:</strong>{' '}
                                        { selectedBird.order ? selectedBird.order : 'No disponible' }.
                                    </p>
                                    <p className='card-text'>
                                        <strong>Origen de especie:</strong>{' '}
                                        { selectedBird.species ? selectedBird.species : 'No disponible'}.
                                    </p>
                                    <p className='card-text'>
                                        <strong>Tamaño:</strong>{' '}
                                        { selectedBird.size ? selectedBird.size : 'No disponible'}.
                                    </p>
                                    <p className='card-text'>
                                        <strong>Ubicación:</strong>{' '}
                                        { selectedBird.map.title ? selectedBird.map.title : 'No disponible'}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyApi;
