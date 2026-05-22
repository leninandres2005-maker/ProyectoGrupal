import { useEffect, useState } from "react";


function ListaProductos() [

    const [productos, setProductos] = useState([]);
    const accessKey = 'aVi9cRhtwFFKb55altpMyhGqH71RMBYq8vYBj-yNlps';

    useEffect(() => {
        fetch('https:api.unsplash.com/search/photos?query=minimalist-clothing&per_page=6&client_id=${accessKey}')
        .then(response => response.json())
        .then(data => {
            
            const producto = data.results.map((foto, index) => {
                return {
                    id: foto.id,

                    nombre: foto.alt_description || `Prenda Colección ${index + 1}`;
                    precio: Math.floor(Math.random() * (75 - 15 + 1)) + 15,
                    imagen: foto.urls.regular
                };
            });

            setProductos(productosFormateados);

        })

    }, [])



]