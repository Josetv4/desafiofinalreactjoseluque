function Buscador({ searchText, onSearch, birds }) {
    const handleSearch = ( e ) => {
        onSearch( e.target.value );
    };

    return (
        <div>
            <input
                className='form-control'
                autoFocus
                type='text'
                placeholder='Buscar aves por nombre'
                value = { searchText }
                onChange = { handleSearch }
            />
        </div>
    );
}

export default Buscador;